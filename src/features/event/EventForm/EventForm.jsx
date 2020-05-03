import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Segment,
  Form,
  Button,
  Grid,
  GridColumn,
  Header,
} from 'semantic-ui-react';

import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan,
} from 'revalidate';

import { createEvent, updateEvent } from '../eventActions.js';
import cuid from 'cuid';
import TextInput from '../../../app/common/form/TextInput.jsx';
import TextArea from '../../../app/common/form/TextArea.jsx';
import SelectInput from '../../../app/common/form/SelectInput.jsx';
import DateInput from '../../../app/common/form/DateInput.jsx';

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {
    // title: '',
    // date: '',
    // city: '',
    // venue: '',
    // hostedBy: '',
  };

  if (eventId && state.events.length > 0) {
    event = state.events.filter((event) => event.id === eventId)[0];
  }
  return {
    initialValues: event,
  };
};

const actions = {
  createEvent,
  updateEvent,
};

const category = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' },
];

const validate = combineValidators ({
  title: isRequired({message:'The event title is required'}),
  category: isRequired({message: 'The category is required'}),
  description: composeValidators(
    isRequired({message: 'Description is required'}),
    hasLengthGreaterThan(10 )({message:'Minimum lenght of description is 10 characters'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('date') 
});
class EventForm extends Component {
  // state = { ...this.props.event };

  // componentDidMount() {
  //   if (this.props.selectedEvent !== null) {
  //     this.setState({
  //       ...this.props.selectedEvent,
  //     });
  //   }
  // }

  onFormSubmit = (values) => {
    if (this.props.initialValues.id) {
      this.props.updateEvent(values);
      this.props.history.push(`/events/${this.props.initialValues.id}`);
    } else {
      const newEvent = {
        ...values,
        id: cuid(),
        hostPhotoURL: '/assets/user.png',
        hostedBy: 'Bob',
      };
      this.props.createEvent(newEvent);
      this.props.history.push(`/events/${newEvent.id}`);
      // this.props.history.push(`/events`);
    }
  };

  // handlesInputChange = (event) => {
  //   this.setState({
  //     [event.target.name]: event.target.value,
  //   });
  // };

  // // destructured version - a little more concise
  // // https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199636#questions/9058616
  // handlesInputChange = ({ target: { name, value } }) => {
  //   this.setState({
  //     [name]: value,
  //   });
  // };

  render() {
    // const { cancelOpeningForm } = this.props;
    // const { title, date, city, venue, hostedBy } = this.state;

    const { history, initialValues, invalid, submitting, pristine } = this.props;

    return (
      <Grid>
        <GridColumn width={10}>
          <Segment>
            <Header sub color='teal' content='Event Details' />
            <Form
              onSubmit={this.props.handleSubmit(this.onFormSubmit)}
              autoComplete='off'
            >
              <Field
                name='title'
                component={TextInput}
                placeholder='Give your event a name'
              />
              <Field
                name='category'
                component={SelectInput}
                options={category}
                placeholder='What is your event about? '
              />
              <Field
                name='description'
                component={TextArea}
                rows={3}
                placeholder='Tell us more about your event'
              />
              <Header sub color='teal' content='Event Location Details' />
              <Field
                name='city'
                component={TextInput}
                placeholder='Event City'
                />
              <Field
                name='venue'
                component={TextInput}
                placeholder='Event Venue'
                />
              <Field
                name='date'
                component={DateInput}
                dateFormat='dd LLL yyyy h:mm a'
                showTimeSelect
                timeFormat='HH:mm'
                placeholder='Event Date'
              />

              <Button disabled={invalid || submitting || pristine} positive type='submit'>
                Submit
              </Button>
              <Button
                onClick={
                  initialValues.id
                    ? () => history.push(`/events/${initialValues.id}`)
                    : () => history.push('/events')
                }
                type='button'
              >
                Cancel
              </Button>
            </Form>
          </Segment>
        </GridColumn>
      </Grid>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(reduxForm({ form: 'eventForm', validate })(EventForm));

// <Form.Field>
//           <label>Event Title</label>
//           {/* ref='title' */}
//           <input
//             name='title'
//             onChange={this.handlesInputChange}
//             value={title}
//             placeholder='Title of the event'
//           />
//         </Form.Field>
// <Form.Field>
// <label>Event Date</label>
// <input
//   name='date'
//   onChange={this.handlesInputChange}
//   value={date}
//   type='date'
//   placeholder='Event Date'
// />
// </Form.Field>
// <Form.Field>
// <label>City</label>
// <input
//   name='city'
//   onChange={this.handlesInputChange}
//   value={city}
//   placeholder='City event is taking place'
// />
// </Form.Field>
// <Form.Field>
// <label>Venue</label>
// <input
//   name='venue'
//   onChange={this.handlesInputChange}
//   value={venue}
//   placeholder='Enter the Venue of the event'
// />
// </Form.Field>
// <Form.Field>
// <label>Hosted By</label>
// <input
//   name='hostedBy'
//   onChange={this.handlesInputChange}
//   value={hostedBy}
//   placeholder='Enter the name of person hosting'
// />
// </Form.Field>
