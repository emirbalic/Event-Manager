import React, { Fragment } from 'react';
import { Segment, Item, Label } from 'semantic-ui-react'; //List
import { Link } from 'react-router-dom';

const EventDetailedSidebar = ({ attendees }) => {
  // const isHost = false;

  return (
    <Fragment>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {attendees && attendees.length} {attendees && attendees.length === 1? 'Person': 'People'} Going
      </Segment>
      <Segment attached>
        <Item.Group divided>
          {attendees &&
            attendees.map((attendee) => (
              <Item key={attendee.id} style={{ position: 'relative' }}>
                {attendee.host &&  <Label
                  style={{ position: 'absolute' }}
                  color='orange'
                  ribbon='right'
                >
                  Host
                </Label>}
               
               
                <Item.Image size='tiny' src={attendee.photoURL} />
                <Item.Content verticalAlign='middle'>
                  <Item.Header as='h3'>
                    <Link to={`/profile/${attendee.id}`}>
                    {attendee.displayName}
                    </Link>
                    </Item.Header>
                </Item.Content>
              </Item>
            ))}
        </Item.Group>
      </Segment>
    </Fragment>
  );
};

export default EventDetailedSidebar;


// Option w list no control over size<List relaxed divided>

// {attendees &&
//   attendees.map((attendee) => (
//     <Item key={attendee.id} style={{ position: 'relative' }}>
//       <Label
//         style={{ position: 'absolute' }}
//         color='orange'
//         ribbon='right'
//       >
//         Host
//       </Label>
//       {/* size='tiny'  */}
//       <Item.Image src={attendee.photoURL} />
//       <Item.Content verticalAlign='middle'>
//         <Item.Header as='h5'>{attendee.name}</Item.Header>
//       </Item.Content>
//     </Item>
//   ))}
// </List>