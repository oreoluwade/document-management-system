import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignupForm from './SignupForm';
import { userSignupRequest, isUserExists } from '../../actions/signupActions';
import { addFlashMessage } from '../../actions/flashMessages';

class SignupPage extends Component {
  render() {
    const { userSignupRequest, addFlashMessage, isUserExists } = this.props;
    return (
      <div className="card" id="signupcard">
        <div>
          <SignupForm
            isUserExists={isUserExists}
            userSignupRequest={userSignupRequest}
            addFlashMessage={addFlashMessage} />
        </div>
      </div>
    );
  }
}

SignupPage.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired
};

export default connect(
  null,
  {
    userSignupRequest,
    addFlashMessage,
    isUserExists
  })(SignupPage);
