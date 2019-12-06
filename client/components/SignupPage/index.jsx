import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignupForm from './SignupForm';
import { userAlreadyExists, registerUser } from '../../actions';

const SignupPage = props => (
    <div className="auth-panel">
        <SignupForm
            userAlreadyExists={props.userAlreadyExists}
            registerUser={props.registerUser}
        />
    </div>
);

SignupPage.propTypes = {
    registerUser: PropTypes.func.isRequired,
    userAlreadyExists: PropTypes.func.isRequired
};

export default connect(null, {
    registerUser,
    userAlreadyExists
})(SignupPage);
