import React, { Component } from 'react';
import { Segment, Item, Icon, List, Button, Label } from 'semantic-ui-react';
import EventListAtendee from './EventListAtendee';
import { Link } from 'react-router-dom';
import { format } from 'date-fns/esm';
import { objectToArray } from '../../../app/common/util/helper';
// import { parseISO } from 'date-fns';

class EventListItem extends Component {
  render() {
    const { event } = this.props; //selectEvent, deleteEvent
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size='tiny' circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/events/${event.id}`}>{event.title}</Item.Header>
                <Item.Description>
                  <Link to={`/profile/${event.hostUid}`}>
                  Hosted by {event.hostedBy}
                  </Link>
                  </Item.Description>
                { event.cancelled &&
                  <Label
                  style={{ top: '-40px' }}
                  ribbon='right'
                  color='red'
                  content='This event has been cancelled'
                />}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name='clock' />
            {format(event.date.toDate(), 'EEEE do LLL')} at{' '}
            {format(event.date.toDate(), 'h:mm a')} |
            <Icon name='marker' /> {event.venue}
          </span>
        </Segment>
        <Segment secondary>
          <List horizontal>
            {/* very cool conditional
            https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199648#questions */}
            {event.attendees &&
              // for the firestore objectvalues for array and index for the key instead of key={attendee.id}
              objectToArray(event.attendees).map((attendee) => (
                <EventListAtendee key={attendee.id} attendee={attendee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>
          {/* <Button
            onClick={() => deleteEvent(event.id)}
            as='a'
            color='red'
            floated='right'
            content='Delete'
          /> */}
          {/* == previous version ==  */}
          {/* onClick={() => selectEvent(event)} */}
          <Button
            as={Link}
            to={`/events/${event.id}`}
            color='teal'
            floated='right'
            content='View'
          />
        </Segment>
      </Segment.Group>
    );
  }
}

export default EventListItem;
