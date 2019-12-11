import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FaceIcon from '@material-ui/icons/Face';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockSharpIcon from '@material-ui/icons/LockSharp';
import EmailIcon from '@material-ui/icons/Email';
import TextFieldGroup from '../Common/TextFieldGroup';
import { signupValidator } from '../../utils';

class SignupForm extends React.Component {
    state = {
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: 2,
        errors: {},
        submitting: false,
        invalid: false
    };

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    isValid = () => {
        const {
            username,
            firstname,
            lastname,
            email,
            password,
            confirmPassword
        } = this.state;

        const payload = {
            username,
            firstname,
            lastname,
            email,
            password,
            confirmPassword
        };
        const { errors, isValid } = signupValidator(payload);
        return !isValid ? this.setState({ errors }) : isValid;
    };

    checkUserExists = e => {
        const { name: field, value: val } = e.target;
        if (val !== '') {
            this.props.userAlreadyExists(val).then(response => {
                const { errors } = this.state;
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
    };

    handleSubmit = e => {
        const {
            username,
            firstname,
            lastname,
            email,
            password,
            roleId
        } = this.state;

        e.preventDefault();

        if (this.isValid()) {
            this.setState({ errors: {}, submitting: true });

            const payload = {
                username,
                firstname,
                lastname,
                email,
                password,
                roleId
            };

            this.props
                .registerUser(payload)
                .then(
                    () => {
                        this.props.history.push('/');
                    },
                    err => {
                        this.setState({
                            errors: err.response.data,
                            submitting: false
                        });
                    }
                )
                .catch(err => {
                    console.log('Error after registering', err);
                });
        }
    };

    render() {
        const {
            state: {
                errors,
                password,
                submitting,
                invalid,
                username,
                email,
                firstname,
                lastname,
                confirmPassword
            },
            checkUserExists,
            handleInputChange,
            handleSubmit
        } = this;

        return (
            <form className="auth-form">
                <TextFieldGroup
                    icon={<FaceIcon />}
                    error={errors.username}
                    onChange={handleInputChange}
                    onBlur={checkUserExists}
                    value={username}
                    field="username"
                    name="username"
                    type="text"
                    inputClass="auth-input-box"
                    placeholder="Username"
                />

                <TextFieldGroup
                    icon={<PermIdentityIcon />}
                    error={errors.firstname}
                    onChange={handleInputChange}
                    value={firstname}
                    field="firstname"
                    name="firstname"
                    type="text"
                    inputClass="auth-input-box"
                    placeholder="First Name"
                />

                <TextFieldGroup
                    icon={<AccountCircleIcon />}
                    error={errors.lastname}
                    onChange={handleInputChange}
                    value={lastname}
                    field="lastname"
                    name="lastname"
                    type="text"
                    inputClass="auth-input-box"
                    placeholder="Last Name"
                />

                <TextFieldGroup
                    icon={<EmailIcon />}
                    error={errors.email}
                    onChange={handleInputChange}
                    checkUserExists={checkUserExists}
                    value={email}
                    field="email"
                    type="email"
                    inputClass="auth-input-box"
                    placeholder="Email"
                />

                <TextFieldGroup
                    icon={<LockOutlinedIcon />}
                    error={errors.password}
                    onChange={handleInputChange}
                    value={password}
                    field="password"
                    name="password"
                    type="password"
                    inputClass="auth-input-box"
                    placeholder="Password"
                />

                <TextFieldGroup
                    icon={<LockSharpIcon />}
                    error={errors.confirmPassword}
                    onChange={handleInputChange}
                    value={confirmPassword}
                    field="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    inputClass="auth-input-box"
                    placeholder="Confirm Password"
                />

                <button
                    disabled={submitting || invalid}
                    className="btn btn-default"
                    type="button"
                    onClick={handleSubmit}
                >
                    REGISTER
                </button>
            </form>
        );
    }
}

SignupForm.propTypes = {
    registerUser: PropTypes.func.isRequired,
    userAlreadyExists: PropTypes.func.isRequired,
    history: PropTypes.object
};

SignupForm.contextTypes = {
    router: PropTypes.object
};

export default withRouter(SignupForm);
