import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../store/actions/index';

class Login extends Component {
    state = {
        username: '',
        password: '',
    };

    clearMessageTimeout = () => {
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
    }

    setMessageTimeout = (ms) => {
        this.messageTimeout = setTimeout(() => {
            this.props.unsetGlobalMessage();
        }, ms || 5000);
    }

    async componentDidMount() {
        if (this.props.authState === '1') {
            await this.props.history.push('/users');
        }
    }

    login = async () => {
        if (this.state.username === 'admin' && this.state.password === 'claysol@losyalc') {
            await this.props.setAuthState('1');
            await this.props.history.push('/users');
        }
        else {
            this.props.setGlobalMessage('Invalid credentials', 'error');
            this.setMessageTimeout();
        }
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    render() {
        return (
            <div className={'col-md-12'}>
                <div className="container-fluid pr-0">
                    <div className="row pr-3">
                        <div className="col-4 mx-auto my-4 text-center">
                            <h4>Login</h4>
                            <input type="test" className="form-control my-2" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} />
                            <input type="password" className="form-control my-2" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} />
                            <button className="btn btn-primary my-2" onClick={this.login}>Go</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authState: state.auth.authState,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setGlobalMessage: (msg, type) => dispatch(actions.setGlobalMessage(msg, type)),
        unsetGlobalMessage: () => dispatch(actions.unsetGlobalMessage()),
        setAuthState: (authState) => dispatch(actions.setAuthState(authState)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));