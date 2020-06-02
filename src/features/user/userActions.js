import { toastr } from 'react-redux-toastr';
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions';
import cuid from 'cuid';

export const updateProfile = (user) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  // <<< spread operator is excluding fields that are not necessary and updatedUser is fields from redux form minus these two >>> //
  const { isLoaded, isEmpty, ...updatedUser } = user;
  toastr.success('Success', 'Your profile has been updated');
  try {
    await firebase.updateProfile(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

export const uploadProfileImage = (file, imageName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid();
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName,
  };

  try {
    dispatch(asyncActionStart());
    // upload photo
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    // get Url
    let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
    // get userdoc
    let userDoc = await firestore.get(`users/${user.uid}`);
    // check if user has a photo
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL,
      });
      // optional
      await user.updateProfile({
        photoURL: downloadURL,
      });
    }
    await firestore.add(
      {
        collection: 'users',
        doc: user.uid,
        subcollections: [{ collection: 'photos' }],
      },
      {
        name: imageName,
        url: downloadURL,
      }
    );
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const deletePhoto = (photo) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;

  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: 'users',
      doc: user.uid,
      subcollections: [{ collection: 'photos', doc: photo.id }],
    });
  } catch (error) {
    console.log(error);
    throw new Error('Problem deleting the photo');
  }
};

export const setMainPhoto = (photo) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  try {
    return await firebase.updateProfile({
      photoURL: photo.url,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Problem setting main photo');
  }
};

export const goingToEvent = (event) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  const profile = getState().firebase.profile;
  const attendee = {
    going: true,
    joinDate: firestore.FieldValue.serverTimestamp(),
    photoURL: profile.photoURL || '/assets/user.png',
    displayName: profile.displayName,
    host: false,
  };
  try {
    // eslint-disable-next-line no-restricted-globals
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: attendee,
    });
    await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
      eventId: event.id,
      userUid: user.uid,
      eventDate: event.date,
      host: false,
    });
    toastr.success('Success', 'You have signed up to an event');
  } catch (error) {
    console.log(error);
    toastr.error('Oops', 'Problem signing to an event');
  }
};

export const cancelGoingToEvent = (event) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete(),
    });
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    toastr.success('Success', 'You have unsubscribed from event');
  } catch (error) {
    console.log(error);
    toastr.error('Oops', 'Something went wrong');
  }
};
