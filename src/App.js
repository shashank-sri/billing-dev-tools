import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Users from './components/Users/Users';
import Message from './components/Message/Message';
import * as actions from './store/actions/index';

class App extends Component {
    async componentDidMount() {
        let authState = localStorage.getItem('authState');
        if (authState != null) {
            await this.props.setAuthState(authState);
            if (this.props.authState === '1') {
                this.props.history.push('/users');
            }
        }
    }

    render() {
        // let routes = (
        //     <Switch>
        //         <Route path="/login" component={Login} />
        //         <Redirect to="/login" />
        //     </Switch>
        // )

        // if (this.props.authState === '1') {
        //     routes = (
        //         <Switch>
        //             <Route path="/users" component={Users} />
        //             <Redirect to="/users" />
        //         </Switch>
        //     )
        // }
        return (
            <div className="App">
                <Header />
                <div className="container-fluid">
                    <div className="row">
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route path="/users" component={Users} />
                            <Redirect to="/users" />
                        </Switch>
                    </div>
                </div>
                <Message />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAuthState: (authState) => dispatch(actions.setAuthState(authState)),
    };
}

export default connect(null, mapDispatchToProps)(withRouter(App));
