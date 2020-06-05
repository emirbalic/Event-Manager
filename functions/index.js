const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const newActivity = (type, event, id) => {
  return {
    type: type,
    eventDate: event.date,
    hostedBy: event.hostedBy,
    title: event.title,
    photoURL: event.hostPhotoURL,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    hostUid: event.hostUid,
    eventId: id,
  };
};
exports.createActivity = functions.firestore
  .document('events/{eventId}')
  .onCreate((event) => {
    let newEvent = event.data();

    console.log(newEvent);

    const activity = newActivity('newEvent', newEvent, event.id);

    console.log(activity);

    return admin
      .firestore()
      .collection('activity')
      .add(activity)
      .then((docRef) => {
        return console.log('Activity created with ID: ', docRef.id);
      })
      .catch((error) => {
        return console.log('error adding activity', error);
      });
  });

exports.cancelActivity = functions.firestore
  .document('events/{eventId}')
  .onUpdate((event, context) => {
    let updatedEVent = event.after.data();
    let previousEventData = event.before.data();

    console.log({ event });
    console.log({ context });
    console.log({ updatedEVent });
    console.log({ previousEventData });

    if (
      !updatedEVent.cancelled ||
      updatedEVent.cancelled === previousEventData.cancelled
    )
      return false;

    const activity = newActivity(
      'cancelledEvent',
      updatedEVent,
      context.params.eventId
    );

    console.log(activity);

    return admin
      .firestore()
      .collection('activity')
      .add(activity)
      .then((docRef) => {
        return console.log('Activity created with ID: ', docRef.id);
      })
      .catch((error) => {
        return console.log('error adding activity', error);
      });
  });
