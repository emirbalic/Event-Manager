import React, { Component } from 'react';
import { Grid,  Loader } from 'semantic-ui-react'; //, Button
import { connect } from 'react-redux';

import EventList from '../EventList/EventList';
// import EventForm from '../EventForm/EventForm';
// import cuid from 'cuid';
// import { createEvent, updateEvent } from '../eventActions'; //, deleteEvent
import { getEventsForDashboard } from '../eventActions'; //, deleteEvent
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';
import { firestoreConnect } from 'react-redux-firebase'; //, isLoaded

const mapStateToProps = (state) => ({
  events: state.events,
  loading: state.async.loading,
  // remove events from firestore
  // events: state.firestore.ordered.events,

  // loading: state.async.loading,
});

const mapDispatchToProps = {
  // createEvent,
  // // deleteEvent,
  // updateEvent,
  getEventsForDashboard,
};

class EventDashboard extends Component {
  // state = {
  //   isOpen: false,
  //   selectedEvent: null,
  // };

  // NO TOGGLE
  // handleOpeningForm = () => {
  //   this.setState({isOpen : true})
  // }

  // TOGGLE
  // handleToggleForm = () => {
  //   this.setState((previousState) => ({ isOpen: !previousState.isOpen }));
  // };

  // DESTRUCTURE {GARANTEE THAT THIS OPERATION IS HAPPENING SYNC}
  // commented for selectEvent/ instead two new
  // handleToggleForm = () => {
  //   this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  // };

  // these two are from
  // https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199736#questions/4804710

  // handleCreateFormOpen = () => {
  //   this.setState({
  //     isOpen: true,
  //     selectedEvent: null,
  //   });
  // };
  // handleFormCancell = () => {
  //   this.setState({
  //     isOpen: false,
  //   });
  // };

  // handleCreateEvent = (newEvent) => {
  //   newEvent.id = cuid();
  //   newEvent.hostPhotoURL = '/assets/user.png';

  //   // this.setState(({ events }) => ({
  //   //   // == PREVIOUS VERSION WO REDUX ==
  //   //     // events: [...events, newEvent],
  //   //     isOpen: false,
  //   //   }));

  //     // == VERSION W REDUX ==
  //     this.props.createEvent(newEvent);
  // };

  // handleSelectEvent = (event) => {
  //   this.setState({
  //     selectedEvent: event,
  //     isOpen: true,
  //   });
  // };

  // handleUpdateEvent = (updatedEvent) => {

  //   // == VERSION W REDUX ==
  //   this.props.updateEvent(updatedEvent);

  //   // this.setState(({ events }) => ({
  //   //   // == PREVIOUS VERSION WO REDUX ==
  //   //   // events: events.map((event) => {
  //   //   //   if (event.id === updatedEvent.id) {
  //   //   //     return { ...updatedEvent };
  //   //   //   } else {
  //   //   //     return event;
  //   //   //   }
  //   //   // }),
  //   //   isOpen: false,
  //   //   selectedEvent: null,
  //   // }));
  // };

  // handleDeleteEvent = (id) => {
  //   // == PREVIOUS VERSION WO REDUX ==
  //   // this.setState(({ events }) => ({
  //   //   events: events.filter((e) => e.id !== id),
  //   // }));
  //   this.props.deleteEvent(id);
  // };

  state = {
    moreEvents: false,
    loadingInitial: true,
    loadedEvents: [],
  };
  async componentDidMount() {
    let next = await this.props.getEventsForDashboard();
    // console.log('next');
    // console.log(next);

    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        loadingInitial: false,
      });
    }
  }

  // prevProps
  componentDidUpdate = (previousProps) => {
    if (this.props.events !== previousProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...this.props.events],
      });
    }
  };

  getNextEvents = async () => {
    const { events } = this.props;
    let lastEvent = events && events[events.length - 1];
    // console.log('lastEvent');
    // console.log(lastEvent);

    let next = await this.props.getEventsForDashboard(lastEvent);
    // console.log('next again');
    // console.log(next);

    if (next && next.docs && next.docs.length <= 1) {
      // console.log('SETTING STATE TO FALSE');
      this.setState({
        moreEvents: false,
      });
      // console.log('more events?');
      // console.log(this.moreEvents);
    }
  };
  render() {
    // const { isOpen, selectedEvent } = this.state;
    const { loading } = this.props; // , loading , events,
    const { moreEvents, loadedEvents } = this.state;

    // this is firebase's equivalent to 'loading'
    // if (!isLoaded(events)) return <LoadingComponent />;
    // if (loading) return <LoadingComponent />;
    if (this.state.loadingInitial) return <LoadingComponent />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            getNextEvents={this.getNextEvents}
            loading={loading}
            moreEvents={moreEvents}
            // events={events}
            events={loadedEvents}
            // selectEvent={this.handleSelectEvent}
            // deleteEvent={this.handleDeleteEvent}
          />
          {/* <Button
            loading={loading}
            content='More'
            color='green'
            floated='right'
            disabled={!this.state.moreEvents}
            onClick={this.getNextEvents}
          /> */}
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
          {/* <Button
            onClick={this.handleCreateFormOpen}
            positive
            content='Create Event'
          />
          {isOpen && (
            <EventForm
              key={selectedEvent ? selectedEvent.id : 0}
              // https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199736#questions/4804710
              updateEvent={this.handleUpdateEvent}
              // https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199648#questions
              createEvent={this.handleCreateEvent}
              cancelOpeningForm={this.handleFormCancell}
              // https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199736#questions/4804710
              selectedEvent={selectedEvent}
            /> */}
          {/* )} */}
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(firestoreConnect([{ collection: 'events' }])(EventDashboard));
