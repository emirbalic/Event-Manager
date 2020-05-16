import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { incrementCounter, decrementCounter } from './testActions';
import { incrementAsync, decrementAsync } from './testActions';
import { Button } from 'semantic-ui-react';
import TestPlaceInput from './TestPlaceInput';
import SimpleMap from './SimpleMap';

import { openModal } from '../modals/modalActions';

import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

// this is the one with () vs return
const mapStateToProps = (state) => {
  return {
    data: state.test.data,
    loading: state.async.loading,
    buttonName: state.async.elementName
  };
};

// dispatch, ownProps
const mapDispatchToProps = {
  // really it makes sense to call these 'actions'

  // incrementCounter,
  // decrementCounter,
  incrementAsync,
  decrementAsync,
  openModal,
};

// const getCoordinates = (dataFromInput) => {
//   console.log(dataFromInput);
// }
class TestComponent extends Component {
  state = {
    latlng: {
      lat: 59.95,
      lng: 30.33,
    },
  };

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({
          latlng: latLng,
        });
      })
      .catch((error) => console.error('Error', error));
  };

  render() {
    // const { data, incrementCounter, decrementCounter, openModal } = this.props;
    const {
      data,
      incrementAsync,
      decrementAsync,
      openModal,
      loading,
      buttonName
    } = this.props;
    return (
      <div>
        <h1>Test Component</h1>
        <h3>The Answer is: {data}</h3>
        {/* <Button onClick={incrementCounter} positive content='Increment' />
        <Button onClick={decrementCounter} negative content='Decrement' /> */}
        <Button
          name='increment'
          loading={buttonName === 'increment' && loading}
          onClick={(e) => incrementAsync(e.target.name)}
          positive
          content='Increment'
        />
        <Button
          name='decrement'
          loading={buttonName === 'decrement' && loading}
          onClick={(e) => decrementAsync(e.target.name)}
          negative
          content='Decrement'
        />
        <Button
          onClick={() => openModal('TestModal', { data: 42 })}
          color='teal'
          content='Open Modal'
        />
        <br />
        <br />
        <br />
        <TestPlaceInput selectAddress={this.handleSelect} />
        <SimpleMap
          key={this.state.latlng.lat + this.state.latlng.lng}
          latlng={this.state.latlng}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);
