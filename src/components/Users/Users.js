import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from '../../services/axios';
import classes from './Users.css';
import * as actions from '../../store/actions/index';

class Users extends Component {
    state = {
        users: [],
        page: 1,
        goToPage: 1,
        pageSize: 20,
        totalUsersCount: null,
        filters: {},
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
            let url = `/users/${rmn}`;
            this.clearMessageTimeout();
            this.props.setGlobalMessage('Deleting user', 'warning');

            return axios.delete(url)
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

    getUsers = async () => {
        if (this.state.totalUsersCount && (this.state.goToPage <= 0 || this.state.goToPage > Math.ceil(this.state.totalUsersCount / this.state.pageSize))) {
            this.props.setGlobalMessage('Invalid Page  Number', 'error');
            this.setMessageTimeout();
            await this.setState((oldState) => ({ goToPage: oldState.page }));
            return;
        }

        let params = {
            pageSize: this.state.pageSize,
            page: this.state.goToPage,
            filters: this.state.filters,
        };

        let url = `/users`;
        console.log(url);

        this.clearMessageTimeout();
        await this.setState({ fetching: true });
        this.props.setGlobalMessage('Getting users', 'warning');

        return axios.post(url, params)
            .then(async (response) => {
                await this.setState({
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
            .finally(async () => {
                await this.setState({ fetching: false });
            });
    }

    goToPage = async (page) => {
        await this.setState({ goToPage: page });
        await this.getUsers();
    }

    handleFilterChange = async (filterId, event) => {
        let filters = this.state.filters;
        filters[filterId] = event.target.value;
        await this.setState({ filters });
    }

    resetFilters = async () => {
        await this.setState({ filters: {} });
        await this.getUsers();
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
            users = (<table className={"table table-hover table-sm table-bordered w-100 " + classes.Table}>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Reg. Date</th>
                        <th scope="col">Mobile (RMN)</th>
                        <th scope="col">VSC No.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Demo User</th>
                        <th scope="col">Status</th>
                        <th scope="col">Subscription</th>
                        <th scope="col">Pacakge MRP (INR)</th>
                        <th scope="col">Pacakge Discount (%)</th>
                        <th scope="col">Order Amount (INR)</th>
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
                                <td>{u.vsc_no}</td>
                                <td>{u.name}</td>
                                <td>{u.demo_user ? 'Yes' : 'No'}</td>
                                <td>{u.user_status}</td>
                                <td>{u.active_subscription && u.active_subscription.package_group_code} - {u.active_subscription && u.active_subscription.package_code}</td>
                                <td>
                                    {u.order && u.order.order_items[0] && u.order.order_items[0].package_max_retail_price.toFixed(2)}
                                </td>
                                <td>
                                    {u.order && u.order.order_items[0] && u.order.order_items[0].package_discount_percentage}
                                </td>
                                <td>
                                    {u.order && u.order.order_amount.toFixed(2)}
                                </td>
                                <td style={{ "width": "130px" }}>
                                    <button type="button" className="m-1 btn btn-danger btn-sm" onClick={() => this.removeUser(u.phone)}>Remove User</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>);

            pageInfo = (
                <li className="" style={{ lineHeight: '31px' }}>
                    Showing {this.state.totalUsersCount == 0 ? 0 : (this.state.pageSize * (this.state.page - 1) + 1)} - {(this.state.pageSize * this.state.page) <= this.state.totalUsersCount ? (this.state.pageSize * this.state.page) : (this.state.totalUsersCount)} users of {this.state.totalUsersCount}
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
                                    <li>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">+91</div>
                                            </div>
                                            <input className="form-control form-control-sm" type="text" placeholder="RMN" value={(this.state.filters && this.state.filters.phone) || ''} onChange={(e) => this.handleFilterChange('phone', e)} />
                                        </div>
                                    </li>
                                    <li className="ml-2">
                                        <div className="input-group">
                                            <input className="form-control form-control-sm" type="text" placeholder="VSC" value={(this.state.filters && this.state.filters.vsc_no) || ''} onChange={(e) => this.handleFilterChange('vsc_no', e)} />
                                        </div>
                                    </li>
                                    <li className="ml-2">
                                        <button type="button" className="btn btn-sm btn-primary" onClick={this.getUsers} >Search</button>
                                        <button type="button" className="btn btn-sm btn-primary ml-2" onClick={this.resetFilters} >Reset</button>
                                    </li>
                                    <li className="ml-auto">
                                        <nav aria-label="Page navigation">
                                            <ul className="pagination pagination-sm">
                                                <li className="px-3">
                                                    {pageInfo}
                                                </li>
                                                <li className={"page-item" + (this.state.page === 1 ? ' disabled' : '')}>
                                                    <a className="page-link" onClick={() => this.goToPage(this.state.page - 1)}>&lt;</a>
                                                </li>
                                                <li className="page-item py-1 mx-2">
                                                    Page
                                                </li>
                                                <li>
                                                    <input type='text' value={this.state.goToPage} onChange={this.updatePage} style={{ width: '40px', textAlign: 'center' }} className=" form-control form-control-sm" />
                                                </li>
                                                <li>
                                                    <button type="button" className="btn btn-primary btn-sm mx-2" onClick={this.getUsers} >Go</button>
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