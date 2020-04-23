import React, { Component } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';

export default class EventForm extends Component {
  state = {
    // not necessary because when values entered the state would be created, but better this way
    title: '',
    date: '',
    city: '',
    venue: '',
    hostedBy: '',
  };

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
    } else {
      this.props.createEvent(this.state);
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
    const { cancelOpeningForm } = this.props;
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
          <Button onClick={cancelOpeningForm} type='button'>
            Cancel
          </Button>
        </Form>
      </Segment>
    );
  }
}
