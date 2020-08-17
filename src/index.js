import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import App from './App';
import AuthReducer from './store/reducers/auth';
import MessageReducer from './store/reducers/message';

const rootReducer = combineReducers({
    message: MessageReducer,
    auth: AuthReducer,
});

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store} >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
