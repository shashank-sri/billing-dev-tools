import * as actionTypes from '../actions/actionTypes';

const initialState = {
    authState: '0',
};

const setAuthState = (state, action) => {
    localStorage.setItem('authState', action.authState || '0');
    return {
        ...state,
        authState: action.authState || '0',
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_AUTH_STATE: return setAuthState(state, action);
        default: return state;
    }
};

export default reducer;
