import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { saveRole, updateRole, loadRoles } from '../../actions/roleActions';

class RolesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: props.role || {},
    };
    this.onChange = this.onChange.bind(this);
    this.saveRole = this.saveRole.bind(this);
    this.updateRole = this.updateRole.bind(this);
  }

  componentWillMount() { // should this be here?
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

  saveRole(event) {
    event.preventDefault();
    const { role } = this.state;
    this.props.saveRole(role).then(() => {
      toastr.success('Role Successfully Saved!');
    }).catch(() => {
      toastr.error('Unable to save role');
    });
  }

  updateRole(event) {
    event.preventDefault();
    const { role } = this.state;
    this.props.updateRole(role).then(() => {
      toastr.success('Role Successfully Updated!');
    }).catch(() => {
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

              <label htmlFor="title" className="active">title</label>
            </div>
            <div className="input-field col s12">
              <input
                id="btnSave"
                type="submit"
                value="Save"
                className="btn-small waves-effect waves-light blue-grey"
                onClick={id ? this.updateRole : this.saveRole}
              />
              <input
                type="submit"
                value="Cancel"
                className="btn-small waves-effect waves-light blue-grey"
                onClick={this.props.cancel}
              />
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

RolesForm.propTypes = {
  auth: PropTypes.object.isRequired,
  cancel: PropTypes.func,
  role: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
  saveRole: PropTypes.func,
  updateRole: PropTypes.func
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

export default connect(mapStateToProps, { loadRoles, saveRole, updateRole })(RolesForm);
