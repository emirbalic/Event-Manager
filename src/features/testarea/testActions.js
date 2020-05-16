import { INCREMENT_COUNTER, DECREMENT_COUNTER } from './testConstants';
// import { asyncActionFinish, asyncActionStart } from '../async/asyncActions';
import { asyncActionFinish } from '../async/asyncActions';
import { ASYNC_ACTION_START } from '../async/asyncConstants';

export const incrementCounter = () => {
  return {
    type: INCREMENT_COUNTER
  }
}
export const decrementCounter = () => {
  return {
    type: DECREMENT_COUNTER
  }
}

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const incrementAsync = (name) => {
  return async dispach => {
    // dispach(asyncActionStart()); but for the name has to be the type && the payload
    dispach({type: ASYNC_ACTION_START, payload: name})
    await delay(1000);
    // it could have been:
    // dispach({type: INCREMENT_COUNTER});
    dispach(incrementCounter());
    dispach(asyncActionFinish())
  }
}
export const decrementAsync = (name) => {
  return async dispach => {
    // dispach(asyncActionStart()); and the same here
    dispach({type: ASYNC_ACTION_START, payload: name})
    await delay(1000);
    // to prove the point:
    dispach({type: DECREMENT_COUNTER});
    // instead of:
    // dispach(incrementCounter());
    dispach(asyncActionFinish())
  }
}