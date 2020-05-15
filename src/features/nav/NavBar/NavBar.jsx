import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menues/SignedOutMenu';
import { SignedInMenu } from '../Menues/SignedInMenu';
import { openModal } from '../../modals/modalActions';
import { logout } from '../../auth/authActions';

//  actions
const mapDispatchToProps = {
  openModal,
  logout
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

class NavBar extends Component {
  // state = {
  //   authenticated: false,
  // };

  // handleSignIn = () => this.setState({ authenticated: true });

  handleSignIn = () => {
    this.props.openModal('LoginModal')
  };

  handleRegister = () => {
    this.props.openModal('RegisterModal')
  };

  handleSignOut = () => {
    // this.setState({ authenticated: false });
    this.props.logout();
    this.props.history.push('/');
  };
  render() {
    const { auth } = this.props;
    const  authenticated  = auth.authenticated;

    return (
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item as={NavLink} exact to='/' header>
            <img src='/assets/logo.png' alt='logo' />
            Event Manager
          </Menu.Item>
          <Menu.Item as={NavLink} exact to='/events' name='Events' />
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
          {authenticated ? (
            <SignedInMenu signOut={this.handleSignOut} currentUser={auth.currentUser} />
          ) : (
            <SignedOutMenu signIn={this.handleSignIn} register={this.handleRegister}/>
          )}
        </Container>
      </Menu>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
