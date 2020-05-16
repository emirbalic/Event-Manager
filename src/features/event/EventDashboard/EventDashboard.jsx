import React, { Component } from 'react';
import { Grid} from 'semantic-ui-react'; //, Button 
import { connect } from 'react-redux';

import EventList from '../EventList/EventList';
// import EventForm from '../EventForm/EventForm';
// import cuid from 'cuid';
import { createEvent, updateEvent, deleteEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';

const mapStateToProps = (state) => ({
  events: state.events,
  loading: state.async.loading
});

const mapDispatchToProps = {
  createEvent,
  deleteEvent,
  updateEvent,
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

  handleUpdateEvent = (updatedEvent) => {
    // == VERSION W REDUX ==
    this.props.updateEvent(updatedEvent);

    // this.setState(({ events }) => ({
    //   // == PREVIOUS VERSION WO REDUX ==
    //   // events: events.map((event) => {
    //   //   if (event.id === updatedEvent.id) {
    //   //     return { ...updatedEvent };
    //   //   } else {
    //   //     return event;
    //   //   }
    //   // }),
    //   isOpen: false,
    //   selectedEvent: null,
    // }));
  };

  handleDeleteEvent = (id) => {
    // == PREVIOUS VERSION WO REDUX ==
    // this.setState(({ events }) => ({
    //   events: events.filter((e) => e.id !== id),
    // }));
    this.props.deleteEvent(id);
  };
  render() {
    // const { isOpen, selectedEvent } = this.state;
    const { events, loading } = this.props;
    if(loading) return <LoadingComponent/>

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            events={events}
            // selectEvent={this.handleSelectEvent}
            deleteEvent={this.handleDeleteEvent}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity/>
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
      </Grid>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDashboard);
