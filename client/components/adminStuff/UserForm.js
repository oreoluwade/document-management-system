import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import TextFieldGroup from '../common/TextFieldGroup';
import { saveUserAdmin, updateUserAdmin } from '../../actions/userActions';
import { addFlashMessage } from '../../actions/flashMessages';
import { loadRoles } from '../../actions/roleActions';

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user || {}, // Object.assign({}, props.userValue),
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
    // this.saveUser = this.saveUser.bind(this);
    // this.clearError = this.clearError.bind(this);
  }

  componentDidMount() {
    this.props.loadRoles();
    $('#mySelectBox').on('change', this.updateSelectState);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user.id !== nextProps.user.id) {
      this.setState({ user: nextProps.user });
    }
  }

  onChange(event) {
    const { name: field, value } = event.target;
    this.setState((state) => {
      const user = Object.assign({},
        state.user, {
          [field]: value,
        });
      return { user };
    });
  }

  updateUser(e) {
    const { user } = this.state;
    e.preventDefault();
    // this.props.updateUserAdmin(this.state.user).then(() => {
    this.props.updateUserAdmin(user).then(() => {
      toastr.success('User Updated Successfully');
    }).catch(() => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Unable to update user'
      });
      toastr.error('Unable to update user');
    });
  }


  render() {
    const { userName, firstName, lastName, email, roleId } = this.state.user;
    const { roles = [] } = this.props;
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
              onChange={this.onChange}
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
              onChange={this.onChange}
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
              onChange={this.onChange}
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
              onChange={this.onChange}
            />
          </div>
          <div className="row margin">
            <label>User Role</label>
            <div className="input-field col s12">
              <select name="roleId" id="mySelectBox"
                value={roleId}
                className="browser-default" onChange={this.onChange}>
                <option value="" disabled >User Role</option>
                {roles.map(role =>
                  (<option key={role.id}
                    value={role.id}>{role.title}</option>)
                )
                }
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-field">
              <input
                type="submit"
                value="Save"
                className="btn waves-effect waves-light blue-grey"
                onClick={this.updateUser} />
              <input
                type="submit"
                value="Cancel"
                className="btn waves-effect waves-light blue-grey"
                onClick={this.props.cancel} />
            </div>
          </div>
        </form>
      </div>
    );
    return (
      <div>
        {form}
      </div>
    );
  }
}


UserForm.propTypes = {
  roles: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  loadRoles: PropTypes.func,
  updateUserAdmin: PropTypes.func,
  saveUserAdmin: PropTypes.func,
  addFlashMessage: PropTypes.func,
  cancel: PropTypes.func,
};

/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps(state) {
  const { roles } = state.manageRoles;
  return {
    roles
  };
}

export default connect(mapStateToProps,
  { loadRoles, saveUserAdmin, updateUserAdmin, addFlashMessage })(UserForm);
