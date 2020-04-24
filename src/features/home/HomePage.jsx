import React from 'react';
import {
  Segment,
  Container,
  Header,
  Image,
  Button,
  Icon,
} from 'semantic-ui-react';

const HomePage = ({ history }) => {
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          Event Manager
        </Header>
        {/* //https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199736#questions/4804710 */}
        <Button onClick={() => history.push('/events')} size='huge' inverted>
          Go!
          <Icon name='right arrow' inverted />
        </Button>
      </Container>
    </Segment>
  );
};

export default HomePage;
