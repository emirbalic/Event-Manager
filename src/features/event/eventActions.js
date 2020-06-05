// import // CREATE_EVENT,
// // UPDATE_EVENT,
// // DELETE_EVENT,
// // FETCH_EVENTS,
// './eventConstants';
// import {
//   asyncActionStart,
//   asyncActionFinish,
//   asyncActionError,
// } from '../async/asyncActions';
// import { fetchSampleDate } from '../../app/data/mockApi';
import { toastr } from 'react-redux-toastr';
import { createNewEvent } from '../../app/common/util/helper';

import firebase from '../../app/config/firebase';
import { FETCH_EVENTS } from './eventConstants';
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions';

export const createEvent = (event) => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const user = firebase.auth().currentUser;
    // const user = firebase.auth().currentUser; // --> possible also like this <--
    const photoURL = getState().firebase.profile.photoURL;
    const newEvent = createNewEvent(user, photoURL, event);

    try {
      let createdEvent = await firestore.add('events', newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true,
      });
      toastr.success('Success!', 'Event has been created!');
      return createdEvent;
    } catch (error) {
      toastr.error('Oops', 'Something went wrong');
    }
  };
};

export const updateEvent = (event) => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    try {
      await firestore.update(`events/${event.id}`, event);
      // dispatch({
      //   type: UPDATE_EVENT,
      //   payload: {
      //     event,
      //   },
      // });
      toastr.success('Success!', 'Event has been updated!');
    } catch (error) {
      toastr.error('Oops', 'Something went wrong');
    }
  };
};

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const message = cancelled
    ? 'Are you sure you want to cancel the event?'
    : 'This will reactivate the event, are your sure?';
  try {
    toastr.confirm(message, {
      onOk: async () =>
        await firestore.update(`events/${eventId}`, {
          cancelled: cancelled,
        }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEventsForDashboard = (lastEvent) => async (
  dispatch,
  getState
) => {
  let today = new Date();
  const firestore = firebase.firestore();

  // const eventsQuery = firestore.collection('events').where('date', '>=', today);

  // only a reference to FS collection of events
  const eventsRef = firestore.collection('events');

  try {
    dispatch(asyncActionStart());
    let startAfter =
      lastEvent &&
      (await firestore.collection('events').doc(lastEvent.id).get());

    // let querySnapshot = await eventsQuery.get();
    let query;

    lastEvent
      ? (query = eventsRef
          .where('date', '>=', today)
          .orderBy('date')
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef
          .where('date', '>=', today)
          .orderBy('date')
          .limit(2));

    let querySnapshot = await query.get();

    if (querySnapshot.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnapshot;
    }

    let events = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
      let evt = {
        ...querySnapshot.docs[i].data(),
        id: querySnapshot.docs[i].id,
      };
      events.push(evt);
    }

    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
    return querySnapshot;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const addEventComment = (eventId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  let newComment = {
    parentId: parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL || '/assets/user.png',
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  }

  try {
    await firebase.push(`event_chat/${eventId}`, newComment);
  } catch (error) {
    console.log(error);
    toastr.error('Oops', 'Cannot add comment');
  }
};

// export const deleteEvent = (eventId) => {
//   return {
//     type: DELETE_EVENT,
//     payload: {
//       eventId,
//     },
//   };
// };
// export const loadEvents = () => {
//   return async (dispatch) => {
//     try {
//       dispatch(asyncActionStart());
//       const events = await fetchSampleDate();
//       dispatch({ type: FETCH_EVENTS, payload: { events } });
//       dispatch(asyncActionFinish());
//     } catch (error) {
//       console.log(error);
//       dispatch(asyncActionError);
//     }
//   };
// };
