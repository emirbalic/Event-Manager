import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import SettingsNav from './SettingsNav';
import { Route, Redirect, Switch } from 'react-router-dom';

import BasicPage from './BasicPage';
import AboutPage from './AboutPage';
import PhotosPage from './PhotosPage';
import AccountPage from './AccountPage';
import { updatePassword } from '../../auth/authActions';
import { updateProfile } from '../../user/userActions';

const mapDispatchToProps = {
  updatePassword,
  updateProfile,
};
//  state.firebase.auth.isLoaded && ... solved in index.render();
const mapStateToProps = (state) => ({
  providerId: state.firebase.auth.providerData[0].providerId,
  user: state.firebase.profile,
});

const SettingsDashboard = ({
  updatePassword,
  providerId,
  user,
  updateProfile,
}) => {
  return (
    <Grid>
      <Grid.Column width={12}>
        <Switch>
          <Redirect exact from='/settings' to='/settings/basic' />
          <Route
            path='/settings/basic'
            render={() => <BasicPage updateProfile={updateProfile} initialValues={user} />}
          />
          <Route 
          path='/settings/about' 
          render={() => <AboutPage updateProfile={updateProfile} initialValues={user} />} />
          <Route path='/settings/photos' component={PhotosPage} />
          {/* passing props to a route page -> render it! */}
          <Route
            path='/settings/account'
            render={() => (
              <AccountPage
                updatePassword={updatePassword}
                providerId={providerId}
              />
            )}
          />
        </Switch>
      </Grid.Column>
      <Grid.Column width={4}>
        <SettingsNav />
      </Grid.Column>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDashboard);
