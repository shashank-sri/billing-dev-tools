import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

class Header extends Component {
    logout = async () => {
        await this.props.setAuthState('0');
        await this.props.history.push('/login');
    }

    render() {
        let logout = null;
        if (this.props.authState === '1') {
            logout = (<button className=" ml-auto btn btn-outline-primary my-2 my-sm-0" onClick={this.logout}>Logout</button>);
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <NavLink className="navbar-brand" to="/">Dev Tools - Billing System</NavLink>
                {logout}
            </nav>
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
    setAuthState: (authState) => { dispatch (actions.setAuthState(authState)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));