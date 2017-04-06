import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { saveRole, updateRole, loadRoles } from '../../actions/roleActions';
import { addFlashMessage } from '../../actions/flashMessages';

class RoleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: props.role || {},
      // titleValue: Object.assign({}, props.roleValue).title,
    };

    this.onChange = this.onChange.bind(this);
    this.saveRole = this.saveRole.bind(this);
    this.updateRole = this.updateRole.bind(this);
  }

  componentWillMount() {
    this.props.loadRoles();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.role.id !== nextProps.role.id) {
      this.setState({ role: nextProps.role });
    }
  }

  onChange(event) {
    event.preventDefault();
    const { name: field, value } = event.target;
    this.setState((state) => {
      const role = Object.assign({},
        state.role, {
          [field]: value,
        });
      return { role };
    });
  }

  saveRole(e) {
    e.preventDefault();
    const { role } = this.state;
    this.props.saveRole(role).then(() => {
      toastr.success('Role Successfully Saved!');
    }).catch(() => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Unable to save role, please try again.'
      });
      toastr.error('Unable to save role');
    });
  }

  updateRole(e) {
    e.preventDefault();
    const { role } = this.state;
    this.props.updateRole(role).then(() => {
      toastr.success('Role Successfully Updated!');
    }).catch(() => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Unable to update role'
      });
      toastr.error('Unable to update role');
    });
  }

  render() {
    const { title, id } = this.state.role;
    const form = (
      <div className="col s12 z-depth-5 card-panel">
        <form>
          <div className="row margin">
            <div className="input-field col s12">
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                placeholder="title"
                className="validate"
                onChange={this.onChange}
              />
              <input
                type="text"
                id="id"
                name="id"
                value={id}
                placeholder="id"
                className="validate"
                onChange={this.onChange}
              />

              <label htmlFor="title" className="active">Role Title</label>
            </div>
            <div className="input-field col s12">
              <input
                id="btnSave"
                type="submit"
                value="Save"
                className="btn waves-effect waves-light blue-grey"
                onClick={id ? this.updateRole : this.saveRole} />
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

RoleForm.propTypes = {
  roles: PropTypes.array.isRequired,
  role: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  saveRole: PropTypes.func,
  updateRole: PropTypes.func,
  addFlashMessage: PropTypes.func.isRequired,
  cancel: PropTypes.func
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

export default connect(mapStateToProps, { loadRoles, saveRole, updateRole, addFlashMessage })(RoleForm);
