import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { TextFieldGroup } from '../Common';
import { updateUserAdmin } from '../../actions/userActions';
import { addFlashMessage } from '../../actions/flashMessages';
import { loadRoles } from '../../actions/roleActions';

class UserForm extends React.Component {
    state = {
        errors: {},
        user: this.props.user || {}
    };

    componentDidMount() {
        this.props.loadRoles();
        $('#mySelectBox').on('change', this.updateSelectState);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.user.id !== nextProps.user.id) {
            this.setState({ user: nextProps.user });
        }
    }

    handleInputChange = event => {
        const { name: field, value } = event.target;
        this.setState(state => {
            const user = Object.assign({}, state.user, {
                [field]: value
            });
            return { user };
        });
    };

    handleUpdateUser = e => {
        e.preventDefault();
        const { user } = this.state;
        this.props
            .updateUserAdmin(user)
            .then(() => {
                toastr.success('User Updated Successfully');
            })
            .catch(() => {
                this.props.addFlashMessage({
                    type: 'error',
                    text: 'Unable to update user'
                });
                toastr.error('Unable to update user');
            });
    };

    render() {
        const {
            state: { userName, firstName, lastName, email, roleId },
            props: { roles = [], cancel },
            handleInputChange,
            handleUpdateUser
        } = this;

        const form = (
            <div className="col s12 z-depth-5 card-panel">
                <form className="login-form">
                    <div className="row margin">
                        <TextFieldGroup
                            type="text"
                            name="firstName"
                            field="firstName"
                            value={firstName}
                            placeholder="first name"
                            icon="person_outline"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="row margin">
                        <TextFieldGroup
                            type="text"
                            name="lastName"
                            field="lastName"
                            value={lastName}
                            placeholder="last name"
                            icon="person_outline"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="row margin">
                        <TextFieldGroup
                            type="text"
                            name="userName"
                            field="userName"
                            value={userName}
                            placeholder="username"
                            icon="person"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="row margin">
                        <TextFieldGroup
                            type="email"
                            name="email"
                            field="email"
                            value={email}
                            placeholder="email"
                            icon="email"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="row margin">
                        <label>User Role</label>
                        <div className="input-field col s12">
                            <select
                                name="roleId"
                                id="mySelectBox"
                                value={roleId}
                                className="browser-default"
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>
                                    User Role
                                </option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {role.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field">
                            <input
                                icon="save"
                                type="submit"
                                value="Save"
                                className="btn waves-effect waves-light blue-grey"
                                onClick={handleUpdateUser}
                            />
                            <input
                                type="submit"
                                value="Cancel"
                                className="btn waves-effect waves-light blue-grey"
                                onClick={cancel}
                            />
                        </div>
                    </div>
                </form>
            </div>
        );
        return <div>{form}</div>;
    }
}

UserForm.propTypes = {
    roles: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    loadRoles: PropTypes.func,
    updateUserAdmin: PropTypes.func,
    addFlashMessage: PropTypes.func,
    cancel: PropTypes.func
};

function mapStateToProps(state) {
    const { roles } = state.manageRoles;
    return {
        roles
    };
}

export default connect(mapStateToProps, {
    loadRoles,
    updateUserAdmin,
    addFlashMessage
})(UserForm);
