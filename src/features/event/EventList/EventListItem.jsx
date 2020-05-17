import React, { Component } from 'react';
import { Segment, Item, Icon, List, Button } from 'semantic-ui-react';
import EventListAtendee from './EventListAtendee';
import { Link } from 'react-router-dom';
import { format } from 'date-fns/esm';
// import { parseISO } from 'date-fns';

class EventListItem extends Component {
  render() {
    const { event, deleteEvent } = this.props; //selectEvent,
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size='tiny' circular src={event.hostPhotoURL} />
              <Item.Content>
                {/* as='a' */}
                <Item.Header>{event.title}</Item.Header>
                <Item.Description>Hosted by {event.hostedBy}</Item.Description>
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
              Object.values(event.attendees).map((attendee, index) => (
                <EventListAtendee key={index} attendee={attendee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>
          <Button
            onClick={() => deleteEvent(event.id)}
            as='a'
            color='red'
            floated='right'
            content='Delete'
          />
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
