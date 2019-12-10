import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import toastr from 'toastr';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import TextFieldGroup from '../Common/TextFieldGroup';
import { loginValidator } from '../../utils';
import { login } from '../../actions/authenticationAction';

class LoginForm extends React.Component {
    state = {
        identifier: '',
        password: '',
        errors: {},
        submitting: false
    };

    isValid() {
        const { identifier, password } = this.state;
        const { errors, isValid } = loginValidator({ identifier, password });
        return !isValid ? this.setState({ errors }) : isValid;
    }

    handleSubmit = e => {
        const { identifier, password } = this.state;
        e.preventDefault();
        if (this.isValid() === true) {
            this.setState({ errors: {}, submitting: true });
            this.props.login({ identifier, password }).then(() => {
                this.props.history.push('/dashboard');
                toastr.success('Logged in Successfully!');
            });
        } else {
            this.setState({
                submitting: false,
                errors: 'Invalid Credentials'
            });
        }
    };

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const {
            state: { errors, identifier, password, submitting },
            handleInputChange,
            handleSubmit
        } = this;

        const emptyFields =
            !identifier.trim().length || !password.trim().length;

        return (
            <form className="auth-form auth-form-login">
                <TextFieldGroup
                    icon={<AccountCircle />}
                    field="identifier"
                    label="Username / Email"
                    value={identifier}
                    error={errors.identifier}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Username / Email"
                    inputClass="auth-input-box"
                />

                <TextFieldGroup
                    icon={<Lock />}
                    field="password"
                    label="Password"
                    value={password}
                    error={errors.password}
                    onChange={handleInputChange}
                    type="password"
                    placeholder="Password"
                    inputClass="auth-input-box"
                />

                {this.state.errors === 'Invalid Credentials' && (
                    <p>{this.state.errors}</p>
                )}

                <button
                    disabled={submitting || emptyFields}
                    className="btn btn-default"
                    type="button"
                    onClick={handleSubmit}
                >
                    LOGIN
                </button>
            </form>
        );
    }
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired,
    history: PropTypes.object
};

const ConnectedLoginForm = connect(null, { login })(LoginForm);

export default withRouter(ConnectedLoginForm);
