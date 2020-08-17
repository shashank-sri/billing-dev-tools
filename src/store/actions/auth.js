import * as actionTypes from './actionTypes';

export const setAuthState = (authState) => {
  return {
    type: actionTypes.SET_AUTH_STATE,
    authState,
  };
}
