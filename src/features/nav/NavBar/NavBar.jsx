import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menues/SignedOutMenu';
import { SignedInMenu } from '../Menues/SignedInMenu';
import { openModal } from '../../modals/modalActions';
// import { logout } from '../../auth/authActions';

//  actions
const mapDispatchToProps = {
  openModal,
  // logout,
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

class NavBar extends Component {
  // state = {
  //   authenticated: false,
  // };

  // handleSignIn = () => this.setState({ authenticated: true });

  handleSignIn = () => {
    this.props.openModal('LoginModal');
  };

  handleRegister = () => {
    this.props.openModal('RegisterModal');
  };

  handleSignOut = () => {
    // this.setState({ authenticated: false });
    this.props.firebase.logout();
    this.props.history.push('/');
  };
  render() {
    const { auth, profile } = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;

    return (
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item as={NavLink} exact to='/' header>
            <img src='/assets/logo.png' alt='logo' />
            Event Manager
          </Menu.Item>
          <Menu.Item as={NavLink} exact to='/events' name='Events' />
          {authenticated && (
            <Fragment>
              <Menu.Item as={NavLink} to='/people' name='People' />
              <Menu.Item as={NavLink} to='/test' name='Test' />
              <Menu.Item>
                <Button
                  as={Link}
                  to='/createEvent'
                  floated='right'
                  positive
                  inverted
                  content='Create Event'
                />
              </Menu.Item>
            </Fragment>
          )}
          {authenticated ? (
            <SignedInMenu
              auth={auth}
              profile={profile}
              signOut={this.handleSignOut}
            />
          ) : (
            <SignedOutMenu
              signIn={this.handleSignIn}
              register={this.handleRegister}
            />
          )}
        </Container>
      </Menu>
    );
  }
}

export default withRouter(
  withFirebase(connect(mapStateToProps, mapDispatchToProps)(NavBar))
);
