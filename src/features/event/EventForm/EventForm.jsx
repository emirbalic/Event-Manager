import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Form, Button } from 'semantic-ui-react';

import { createEvent, updateEvent } from '../eventActions.js';
import cuid from 'cuid';

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {
    title: '',
    date: '',
    city: '',
    venue: '',
    hostedBy: '',
  };

  if (eventId && state.events.length > 0) {
    event = state.events.filter((event) => event.id === eventId)[0];
  }
  return {
    event,
  };
};

const actions = {
  createEvent,
  updateEvent,
};

class EventForm extends Component {
  state = { ...this.props.event };

  componentDidMount() {
    if (this.props.selectedEvent !== null) {
      this.setState({
        ...this.props.selectedEvent,
      });
    }
  }

  handleFormSubmit = (evt) => {
    evt.preventDefault();
    if (this.state.id) {
      this.props.updateEvent(this.state);
      this.props.history.push(`/events/${this.state.id}`);
    } else {
      const newEvent = {
        ...this.state,
        id: cuid(),
        hostPhotoURL: '/assets/user.png',
      };
      this.props.createEvent(newEvent);
      // this.props.history.push(`/events/${newEvent.id}`);
      this.props.history.push(`/events`);
    }
  };

  // handlesInputChange = (event) => {
  //   this.setState({
  //     [event.target.name]: event.target.value,
  //   });
  // };

  // destructured version - a little more concise
  // https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199636#questions/9058616
  handlesInputChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };
  render() {
    // const { cancelOpeningForm } = this.props;
    const { title, date, city, venue, hostedBy } = this.state;

    return (
      <Segment>
        {/* autoComplete='off' */}
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Field>
            <label>Event Title</label>
            {/* ref='title' */}
            <input
              name='title'
              onChange={this.handlesInputChange}
              value={title}
              placeholder='Title of the event'
            />
          </Form.Field>
          <Form.Field>
            <label>Event Date</label>
            <input
              name='date'
              onChange={this.handlesInputChange}
              value={date}
              type='date'
              placeholder='Event Date'
            />
          </Form.Field>
          <Form.Field>
            <label>City</label>
            <input
              name='city'
              onChange={this.handlesInputChange}
              value={city}
              placeholder='City event is taking place'
            />
          </Form.Field>
          <Form.Field>
            <label>Venue</label>
            <input
              name='venue'
              onChange={this.handlesInputChange}
              value={venue}
              placeholder='Enter the Venue of the event'
            />
          </Form.Field>
          <Form.Field>
            <label>Hosted By</label>
            <input
              name='hostedBy'
              onChange={this.handlesInputChange}
              value={hostedBy}
              placeholder='Enter the name of person hosting'
            />
          </Form.Field>
          <Button positive type='submit'>
            Submit
          </Button>
          <Button onClick={this.props.history.goBack} type='button'>
            Cancel
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default connect(mapStateToProps, actions)(EventForm);
