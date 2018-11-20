/* eslint-disable import/no-extraneous-dependencies */

import React, { PropTypes } from 'react';
import validateInput from '../../../server/shared/validations/signup';
import TextFieldGroup from '../Common/TextFieldGroup';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkUserExists = this.checkUserExists.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  checkUserExists(e) {
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

  onSubmit(e) {
    e.preventDefault();

    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.userSignupRequest(this.state).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'Welcome! You have successfully signed up.'
          });
          this.context.router.push('/');
        },
        err => this.setState({ errors: err.response.data, isLoading: false })
      );
    }
  }

  render() {
    const { errors } = this.state;
    const form = (
      <form onSubmit={this.onSubmit}>

        <div className="row margin">
          <TextFieldGroup
            icon="perm_identity"
            error={errors.userName}
            label="Username"
            onChange={this.onChange}
            checkUserExists={this.checkUserExists}
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
            onChange={this.onChange}
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
            onChange={this.onChange}
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
            onChange={this.onChange}
            checkUserExists={this.checkUserExists}
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
            onChange={this.onChange}
            value={this.state.password}
            field="password"
            name="password"
            type="password"
          />
        </div>


        <div className="center-align">
          <button disabled={this.state.isLoading || this.state.invalid}
            className="btn blue-grey" type="submit">
            Sign Up<i className="material-icons right">thumb_up</i>
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
  userSignupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
};

SignupForm.contextTypes = {
  router: PropTypes.object
};

export default SignupForm;
