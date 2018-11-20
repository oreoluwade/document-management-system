import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignupForm from './SignupForm';
import { userSignupRequest, isUserExists } from '../../actions/signupActions';
import { addFlashMessage } from '../../actions/flashMessages';

const SignupPage = props => (
  <div className="card" id="signupcard">
    <div>
      <SignupForm
        isUserExists={props.isUserExists}
        userSignupRequest={props.userSignupRequest}
        addFlashMessage={props.addFlashMessage} />
    </div>
  </div>
);

SignupPage.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired
};

export default connect(null, {
  userSignupRequest,
  addFlashMessage,
  isUserExists
})(SignupPage);
