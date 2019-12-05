import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import toastr from 'toastr';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import TextFieldGroup from '../Common/TextFieldGroup';
import validateInput from '../../../server/shared/validations/login';
import { login } from '../../actions/authenticationAction';
import { addFlashMessage } from '../../actions/flashMessages';

class LoginForm extends React.Component {
    state = {
        identifier: '',
        password: '',
        errors: {},
        isLoading: false
    };

    isValid() {
        const { errors, isValid } = validateInput(this.state);
        return !isValid ? this.setState({ errors }) : isValid;
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.isValid()) {
            this.setState({ errors: {}, isLoading: true });
            this.props.login(this.state).then(
                () => {
                    this.props.history.push('/dashboard');
                    toastr.success('Logged in Successfully!');
                },
                err =>
                    this.setState({
                        errors: err.response.data.errors,
                        isLoading: false
                    })
            );
        }
    };

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const {
            state: { errors, identifier, password, isLoading },
            handleInputChange
        } = this;
        return (
            <form
                className="auth-form auth-form-login"
                onSubmit={this.handleSubmit}
            >
                <TextFieldGroup
                    icon={<AccountCircle />}
                    field="identifier"
                    label="Username / Email"
                    value={identifier}
                    error={errors.identifier}
                    onChange={handleInputChange}
                    type="text"
                />

                <TextFieldGroup
                    icon={<Lock />}
                    field="password"
                    label="Password"
                    value={password}
                    error={errors.password}
                    onChange={handleInputChange}
                    type="password"
                />

                <div className="center-align">
                    <button
                        disabled={isLoading}
                        className="btn blue-grey"
                        type="submit"
                    >
                        Login<i className="material-icons right">thumb_up</i>
                    </button>
                    {errors.form && (
                        <div className="card-panel red darken-1">
                            {errors.form}
                        </div>
                    )}
                </div>
            </form>
        );
    }
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    history: PropTypes.object
};

const ConnectedLoginForm = connect(null, { login, addFlashMessage })(LoginForm);

export default withRouter(ConnectedLoginForm);
