import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Message.css';

class Message extends Component {
  render () {
    let classList = [classes.Message, 'alert', classes[this.props.msgType || 'warning']].join(' ');

    const message = this.props.msg ? (
      <div className={classList}>
        {this.props.msg}
      </div>
    ) : null;

    return message;
  }
}

const mapStateToProps = state => {
  return {
    msg: state.message.message,
    msgType: state.message.messageType,
  }
}

export default connect(mapStateToProps)(Message);
