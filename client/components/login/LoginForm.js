import React from 'react';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';
import validateInput from '../../../server/shared/validations/login';
import { login } from '../../actions/authenticationAction';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
      errors: {},
      isLoading: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      return this.setState({ errors });
    }
    return isValid;
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.login(this.state).then(
        res => this.context.router.push('/'),
        err => this.setState({ errors: err.response.data.errors, isLoading: false })
      );
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, identifier, password, isLoading } = this.state;
    return (
      <div className="card-panel" id="logincard">

        <form className="center-align" id="loginform" onSubmit={this.onSubmit}>
          {errors.form && <div className="alert alert-danger">{errors.form}</div>}

          <TextFieldGroup
            field="identifier"
            label="Username / Email"
            value={identifier}
            error={errors.identifier}
            onChange={this.onChange}
          />

          <TextFieldGroup
            field="password"
            label="Password"
            value={password}
            error={errors.password}
            onChange={this.onChange}
            type="password"
          />
          <div className="form-group">
            <button disabled={isLoading} className="btn waves-effect waves-light light-blue">
              Login<i className="material-icons right">send</i>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  login: React.PropTypes.func.isRequired
};

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(null, { login })(LoginForm);
