import React, { Component, Fragment } from 'react';
import NavBar from '../../features/nav/NavBar/NavBar';
import { Container } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';

import HomePage from '../../features/home/HomePage';
import EventDashboard from '../../features/event/EventDashboard/EventDashboard';
import EventDetailedPage from '../../features/event/EventDetailed/EventDetailedPage';
import PeopleDashboard from '../../features/user/PeopleDashboard/PeopleDashboard';
import UserDetailedPage from '../../features/user/UserDetailed/UserDetailedPage';
import SettingsDashboard from '../../features/user/Settings/SettingsDashboard';
import EventForm from '../../features/event/EventForm/EventForm';
import TestComponent from '../../features/testarea/TestComponent';
import ModalManager from '../../features/modals/ModalManager';
import { UserIsAuthenticated } from '../../features/auth/authWrapper';

class App extends Component {
  render() {
    return (
      <Fragment>
        <ModalManager/>
        <Route exact path='/' component={HomePage} />
        <Route
          // https://www.udemy.com/course/build-an-app-with-react-redux-and-firestore-from-scratch/learn/lecture/10199736#questions/4804710
          path='/(.+)'
          render={() => (
            <Fragment>
              <NavBar />
              <Container className='main'>
                <Switch key={this.props.location.key}>
                  <Route exact path='/events' component={EventDashboard} />
                  <Route path='/events/:id' component={EventDetailedPage} />
                  {/* <Route path='/manage/:id' component={UserIsAuthenticated(EventForm)} /> */}
                  <Route path='/people' component={UserIsAuthenticated(PeopleDashboard)} />
                  <Route path='/profile/:id' component={UserIsAuthenticated(UserDetailedPage)} />
                  <Route path='/settings' component={UserIsAuthenticated(SettingsDashboard)} />
                  <Route path={['/createEvent', '/manage/:id']}component={UserIsAuthenticated (EventForm)}/>
                  <Route path='/test' component={TestComponent} />
                </Switch>
              </Container>
            </Fragment>
          )}
        />
      </Fragment>
    );
  }
}

export default withRouter(App);
