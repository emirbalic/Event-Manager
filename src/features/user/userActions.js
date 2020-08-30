import { toastr } from 'react-redux-toastr';
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions';
import cuid from 'cuid';
import firebase from '../../app/config/firebase';
import { FETCH_EVENTS } from '../event/eventConstants';

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
  getState
  // { getFirebase }
) => {
  // not sure wht is difference #217
  // const firebase = getFirebase();
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const today = new Date();
  let userDocRef = firestore.collection('users').doc(user.uid);
  let eventAttendeeRef = firestore.collection('event_attendee');

  try {
    // return await firebase.updateProfile({
    //   photoURL: photo.url,
    // });

    // #217 == avoid duplication of user photos ==

    dispatch(asyncActionStart())

    let batch = firestore.batch();

    batch.update(userDocRef, {
      photoURL: photo.url,
    });

    let eventQuery = await eventAttendeeRef
      .where('userUid', '==', user.uid)
      .where('eventDate', '>=', today);

    let eventQuerySnapshot = await eventQuery.get();

    for (let i = 0; i < eventQuerySnapshot.docs.length; i++) {
      let eventDocRef = await firestore
        .collection('events')
        .doc(eventQuerySnapshot.docs[i].data().eventId);

      let event = await eventDocRef.get();
      if(event.data().hostUid === user.uid) {
        batch.update(eventDocRef, {
          hostPhotoURL: photo.url,
          [`attendees.${user.uid}.photoURL`]: photo.url
        })
      } else {
        batch.update(eventDocRef, {
          [`attendees.${user.uid}.photoURL`]: photo.url
        })
      }
    }
    // console.log(batch);
    await batch.commit();

    dispatch(asyncActionFinish);

  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());

    throw new Error('Problem setting main photo');

  }
};

export const goingToEvent = (event) => async (
  dispatch,
  getState,
  // { getFirebase, getFirestore }
) => {
  const firestore = firebase.firestore(); //getFirestore();
  // const firebase = getFirebase();
  dispatch(asyncActionStart());
   
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
    let eventDocRef = firestore.collection('events').doc(event.id);
    let eventAttendeeDocRef = firestore.collection('event_attendee').doc(`${event.id}_${user.id}`);

    await firestore.runTransaction(async (transaction) => {
      await transaction.get(eventDocRef);
      await transaction.update(eventDocRef, {
        [`attendees.${user.uid}`]: attendee
      })
      await transaction.set(eventAttendeeDocRef, {
        eventId: event.id,
      userUid: user.uid,
      eventDate: event.date,
      host: false,
      })
    })
    // // eslint-disable-next-line no-restricted-globals
    // await firestore.update(`events/${event.id}`, {
    //   [`attendees.${user.uid}`]: attendee
    // });
    // await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
    //   eventId: event.id,
    //   userUid: user.uid,
    //   eventDate: event.date,
    //   host: false,
    // });
    dispatch(asyncActionFinish());
    toastr.success('Success', 'You have signed up to an event');
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
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

export const getUserEvents = (userUid, activeTab) => async (
  dispatch,
  getState
) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const today = new Date(Date.now());
  let eventsRef = firestore.collection('event_attendee');

  let query;

  switch (activeTab) {
    case 1: //past events
      query = eventsRef
        .where('userUid', '==', userUid)
        .where('eventDate', '<=', today)
        .orderBy('eventDate', 'desc');
      break;
    case 2: //future events
      query = eventsRef
        .where('userUid', '==', userUid)
        .where('eventDate', '>=', today)
        .orderBy('eventDate');
      break;
    case 3: //hosted events
      query = eventsRef
        .where('userUid', '==', userUid)
        .where('host', '==', true)
        .orderBy('eventDate', 'desc');
      break;
    default:
      query = eventsRef
        .where('userUid', '==', userUid)
        .orderBy('eventDate', 'desc');
  }
  try {
    let querySnapshot = await query.get();

    let events = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
      let evt = await firestore
        .collection('events')
        .doc(querySnapshot.docs[i].data().eventId)
        .get();
      events.push({ ...evt.data(), id: evt.id });
    }

    dispatch({ type: FETCH_EVENTS, payload: { events } });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};
