import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from '../../services/axios';
import classes from './Users.css';
import utils from '../../services/utils';
import * as actions from '../../store/actions/index';

class Users extends Component {
    state = {
        users: [],
        page: 1,
        goToPage: 1,
        pageSize: 20,
        totalUsersCount: null,
        entity: null,
        fetching: false,
    }

    messageTimeout = null;

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

    updatePage = (e) => {
        let page = Number(e.target.value);
        if (typeof page === 'number' && !isNaN(page)) {
            this.setState({ goToPage: page });
        }
    }

    removeUser = (rmn) => {
        let deleteUser = window.confirm(`Delete user with RMN ${rmn}?`);
        if (deleteUser) {
            let url = `/remove-user`;
            this.clearMessageTimeout();
            this.props.setGlobalMessage('Deleting user', 'warning');

            return axios.post(url, { rmn })
                .then(async () => {
                    this.props.setGlobalMessage('User Deleted', 'success');
                    this.setMessageTimeout(2000);
                    await this.getUsers();
                })
                .catch(error => {
                    console.log(error);
                    this.props.setGlobalMessage(error.message, 'error');
                    this.setMessageTimeout();
                })
        }
    }

    getUsers = () => {
        if (this.state.totalUsersCount && (this.state.goToPage <= 0 || this.state.goToPage > Math.ceil(this.state.totalUsersCount / this.state.pageSize))) {
            this.props.setGlobalMessage('Invalid Page  Number', 'error');
            this.setMessageTimeout();
            this.setState((oldState) => ({ goToPage: oldState.page }));
            return;
        }

        let params = {
            number: this.state.pageSize,
            page: this.state.goToPage,
        };

        let url = `/get-users${utils.getQueryParams(params)}`;
        console.log(url);

        this.clearMessageTimeout();
        this.setState({ fetching: true });
        this.props.setGlobalMessage('Getting users', 'warning');

        return axios.get(url)
            .then(response => {
                this.setState({
                    users: response.data.users,
                    totalUsersCount: response.data.found,
                    page: this.state.goToPage,
                });
                this.props.unsetGlobalMessage();
            })
            .catch(error => {
                console.log(error);
                this.props.setGlobalMessage(error.message, 'error');
                this.setMessageTimeout();
            })
            .finally(() => {
                this.setState({ fetching: false });
            });
    }

    goToPage = async (page) => {
        await this.setState({ goToPage: page });
        this.getUsers();
    }

    async componentDidMount() {
        //console.log(this.props);
        if (this.props.authState === '0') {
            await this.props.history.push('/login');
        }
        else if (this.props.authState === '1') {
            this.getUsers();
        }
    }

    render() {
        let users = null;
        let pageInfo = null;

        if (this.state.fetching) {
            users = (<div className="col-12 text-center">Loading</div>);
        }
        else {
            users = (<table className={"table table-hover table-sm w-100 " + classes.Table}>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Reg. Date</th>
                        <th scope="col">Mobile (RMN)</th>
                        <th scope="col">RMN Verified</th>
                        <th scope="col">VSC Verified</th>
                        <th scope="col">OTT Subscribed</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">City</th>
                        <th scope="col">State</th>
                        <th scope="col">Pincode</th>
                        <th scope="col">Zone</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.map((u, i) => {
                        return (
                            <tr key={i}>
                                <th scope="row">{((this.state.page - 1) * this.state.pageSize) + i + 1}</th>
                                <td>{new Date(u.created_at).toLocaleString()}</td>
                                <td>{u.phone}</td>
                                <td className={[u.phone_verified ? 'text-success' : 'text-danger', 'text-center'].join(' ')}>
                                    <FontAwesomeIcon icon={u.phone_verified ? faCheck : faTimes} />
                                </td>
                                <td className={[u.vsc_verified ? 'text-success' : 'text-danger', 'text-center'].join(' ')}>
                                    <FontAwesomeIcon icon={u.vsc_verified ? faCheck : faTimes} />
                                </td>
                                <td className={[u.subscribed ? 'text-success' : 'text-danger', 'text-center'].join(' ')}>
                                    <FontAwesomeIcon icon={u.subscribed ? faCheck : faTimes} />
                                </td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td>{u.city}</td>
                                <td>{u.state}</td>
                                <td>{u.pincode}</td>
                                <td>{u.zone}</td>
                                <td style={{"width": "130px"}}>
                                    {/* <button type="button" className="m-1 btn btn-primary btn-sm" disabled={!u.vsc_verified}>VSC Details</button> */}
                                    <button type="button" className="m-1 btn btn-danger btn-sm" onClick={() => this.removeUser(u.phone)}>Remove User</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>);

            pageInfo = (
                <li className="" style={{ lineHeight: '38px' }}>
                    Showing {this.state.pageSize * (this.state.page - 1) + 1}-{(this.state.pageSize * this.state.page) <= this.state.totalUsersCount ? (this.state.pageSize * this.state.page) : (this.state.totalUsersCount)} users of {this.state.totalUsersCount}
                </li>
            );
        }

        return (
            <div className={classes.Users + ' col-md-12'}>
                <div className="container-fluid pr-0">
                    <div className="row">
                        <div className='col-12 pl-0'>
                            <nav>
                                <ol className="breadcrumb">
                                    {pageInfo}
                                    <li className="ml-auto">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                <li className={"page-item" + (this.state.page === 1 ? ' disabled' : '')}>
                                                    <a className="page-link" onClick={() => this.goToPage(this.state.page - 1)}>&lt;</a>
                                                </li>
                                                <li className="page-item py-1 px-3">
                                                    Page <input type='text' value={this.state.goToPage} onChange={this.updatePage} style={{ width: '40px', textAlign: 'center' }} />
                                                    <button type="button" className="btn btn-primary btn-sm ml-2" onClick={this.getUsers} >Go</button>
                                                </li>
                                                <li className={"page-item" + (this.state.page === Math.ceil(this.state.totalUsersCount / this.state.pageSize) ? ' disabled' : '')}>
                                                    <a className="page-link" onClick={() => this.goToPage(this.state.page + 1)}>&gt;</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row pr-3">
                        {users}
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Users));