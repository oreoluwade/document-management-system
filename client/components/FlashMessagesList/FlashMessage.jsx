/* eslint-disable import/no-extraneous-dependencies */

import React, { PropTypes } from 'react';
import classnames from 'classnames';

class FlashMessage extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.deleteFlashMessage(this.props.message.id);
  }

  render() {
    const { type, text } = this.props.message;
    return (
      <div className="row">
        <div className="col s12 l12">
          <div id="card-alert" className={classnames('card', {
            green: type === 'success',
            red: type === 'error'
          })}>
            <div className="card-content white-text">
              <button type="button" id="dismissSignup"
                onClick={this.onClick} className="close right">
                <span>&times;</span>
              </button>
              <p>{text}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FlashMessage.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
};

export default FlashMessage;
