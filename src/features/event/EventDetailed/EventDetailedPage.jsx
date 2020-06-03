import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, GridColumn } from 'semantic-ui-react';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
// import { toastr } from 'react-redux-toastr';
import { objectToArray, createDataTree } from '../../../app/common/util/helper';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  // if(eventId && state.events.length > 0) {
  //   event = state.events.filter(event => event.id === eventId)[0];
  // }

  if (
    state.firestore.ordered.events &&
    state.firestore.ordered.events.length > 0
  ) {
    event =
      state.firestore.ordered.events.filter(
        (event) => event.id === eventId
      )[0] || {};
  }

  return {
    event,
    auth: state.firebase.auth,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) &&
      objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
  };
};

const mapDispatchToProps = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
};

class EventDetailedPage extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);

    // >> same thing here <<
    // const{firestore, match, history} = this.props;
    // let event = await firestore.get(`events/${match.params.id}`);
    // if (!event.exists) {
    //   history.push('/events');
    //   toastr.error('Sorry', 'Event not found');
    // }
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }
  render() {
    const {
      event,
      auth,
      goingToEvent,
      cancelGoingToEvent,
      addEventComment,
      eventChat
    } = this.props;
    const attendees =
      event && event.attendees && objectToArray(event.attendees);
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some((a) => a.id === auth.uid);
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    return (
      <Grid>
        <GridColumn width={10}>
          <EventDetailedHeader
            event={event}
            isGoing={isGoing}
            isHost={isHost}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
          />
          <EventDetailedInfo event={event} />
          <EventDetailedChat
            addEventComment={addEventComment}
            eventId={event.id}
            eventChat={chatTree}
          />
        </GridColumn>
        <GridColumn width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </GridColumn>
      </Grid>
    );
  }
}

// const EventDetailedPage = ({event}) => {
//   return (
//     <Grid>
//       <GridColumn width={10}>
//         <EventDetailedHeader event={event} />
//         <EventDetailedInfo event={event} />
//         <EventDetailedChat />
//       </GridColumn>
//       <GridColumn width={6}>
//         <EventDetailedSidebar attendees={event.attendees} />
//       </GridColumn>
//     </Grid>
//   );
// };

//React Higher Order Component that passes firestore as a prop
//(comes from context.store.firestore)
export default compose(
  withFirestore,
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect((props) => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
