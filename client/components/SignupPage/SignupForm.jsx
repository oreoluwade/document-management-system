import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import validateInput from '../../../server/shared/validations/signup';
import TextFieldGroup from '../Common/TextFieldGroup';

class SignupForm extends React.Component {
  state = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    roleId: 2,
    errors: {},
    isLoading: false,
    invalid: false
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  checkUserExists = (e) => {
    const field = e.target.name;
    const val = e.target.value;
    if (val !== '') {
      this.props.isUserExists(val).then((response) => {
        const errors = this.state.errors;
        let invalid;
        if (response.data.user) {
          errors[field] = `A user already exists with that ${field}`;
          invalid = true;
        } else {
          errors[field] = '';
          invalid = false;
        }
        this.setState({ errors, invalid });
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.userSignupRequest(this.state)
        .then(() => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'Welcome! You have successfully signed up.'
          });
          this.props.history.push('/');
        },
        err => this.setState({ errors: err.response.data, isLoading: false })
      );
    }
  }

  render() {
    const {
      state: { errors },
      checkUserExists,
      handleInputChange,
    } = this;

    const form = (
      <form onSubmit={this.handleSubmit}>

        <div className="row margin">
          <TextFieldGroup
            icon="perm_identity"
            error={errors.userName}
            label="Username"
            onChange={handleInputChange}
            checkUserExists={checkUserExists}
            value={this.state.userName}
            field="userName"
            name="userName"
            type="text"
          />
        </div>

        <div className="row margin">
          <TextFieldGroup
            icon="person"
            error={errors.firstName}
            label="First Name"
            onChange={handleInputChange}
            value={this.state.firstName}
            field="firstName"
            name="firstName"
            type="text"
          />
        </div>

        <div className="row margin">
          <TextFieldGroup
            icon="person_outline"
            error={errors.lastName}
            label="Last Name"
            onChange={handleInputChange}
            value={this.state.lastName}
            field="lastName"
            name="lastName"
            type="text"
          />
        </div>

        <div className="row margin">
          <TextFieldGroup
            icon="email"
            error={errors.email}
            label="Email"
            onChange={handleInputChange}
            checkUserExists={checkUserExists}
            value={this.state.email}
            field="email"
            type="email"
          />
        </div>

        <div className="row margin">
          <TextFieldGroup
            icon="lock"
            error={errors.password}
            label="Password"
            onChange={handleInputChange}
            value={this.state.password}
            field="password"
            name="password"
            type="password"
          />
        </div>


        <div className="row margin">
          <TextFieldGroup
            icon="lock"
            error={errors.passwordConfirmation}
            label="Confirm Password"
            onChange={handleInputChange}
            value={this.state.passwordConfirmation}
            field="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
          />
        </div>


        <div className="center-align">
          <button
            disabled={this.state.isLoading || this.state.invalid}
            className="btn blue-grey"
            type="submit"
          >
            Sign Up
            <i className="material-icons right">thumb_up</i>
          </button>
        </div>

      </form>
    );
    return (
      <div>
        {form}
      </div>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired,
  history: PropTypes.object,
};

SignupForm.contextTypes = {
  router: PropTypes.object
};

export default withRouter(SignupForm);
