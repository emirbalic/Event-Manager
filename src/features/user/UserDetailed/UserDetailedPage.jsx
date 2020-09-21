import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';

import { UserDetailedHeader } from './UserDetailedHeader';
import { UserDetailedDescription } from './UserDetailedDescription';
import { UserDetailedSidebar } from './UserDetailedSidebar';
import { UserDetailedPhotos } from './UserDetailedPhotos';
import { UserDetailedEvents } from './UserDetailedEvents';

import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents } from '../userActions';

// with ownProps I get the access to params being set in the URL
const mapStateToProps = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firestore.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }

  return {
    profile, //: state.firebase.profile,
    userUid,
    events: state.events.userEvents,
    eventsLoading: state.async.loading,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
  };
};
// actions
const mapDispatchToProps = {
  getUserEvents,
};
class UserDetailedPage extends Component {
  async componentDidMount() {
    let events = await this.props.getUserEvents(this.props.userUid);
    console.log('events are: ', events);
  }
  
  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  }
 
  render() {
    const {
      profile,
      photos,
      auth,
      match,
      requesting,
      events,
      eventsLoading,
    } = this.props;
    // combination of auth, match to see if the user is current user
    const isCurrentUser = auth.uid === match.params.id;

    // Object.values to get properties from requesting to check any for 'true'
    // i.e. check for any prop in object if it is true
    const loading = Object.values(requesting).some((a) => a === true);

    // console.log('events', events);
    
    if (loading) return <LoadingComponent />;
    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar isCurrentUser={isCurrentUser} />
        {photos && photos.length > 0 && <UserDetailedPhotos photos={photos} />}
        <UserDetailedEvents  changeTab={this.changeTab} events={events.userEvents} eventsLoading={eventsLoading} />
      </Grid>
    );
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);
