/* eslint class-methods-use-this: "off"*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import RoleList from './RoleList';
import { loadRoles, deleteRole } from '../../actions/roleActions';
import { addFlashMessage } from '../../actions/flashMessages';
import RoleForm from './RoleForm';

class ManangeRolePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayForm: false,
      role: {}
    };
    this.deleteRole = this.deleteRole.bind(this);
    this.renderRoleForm = this.renderRoleForm.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.cancelRoleForm = this.cancelRoleForm.bind(this);
  }

  componentWillMount() {
    this.props.loadRoles();
  }

  componentDidMount() {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  renderAlert(id) {
    this.props.swal({
      title: 'Warning!',
      text: 'Are you sure you want to delete role?',
      type: 'info',
      showCancelButton: true,
      onConfirm: () => this.deleteRole(id),
      onCancel: this.props.close,
    });
  }

  deleteRole(id) {
    this.props.deleteRole(id)
      .then(() => toastr.success('Role Successfully Deleted'))
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Unable to delete role'
        });
        toastr.error(
          'Unable to delete role');
      });
  }

  renderRoleForm(role = {}) {
    const text = 'Update Role Details';
    this.setState({ displayForm: true, text, role });
  }

  cancelRoleForm() {
    this.setState({ displayForm: false, user: {} });
  }

  render() {
    const { roles } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <div className="col s12 z-depth-5 card-panel card-body">
              <h4 className="center">Manage Role Details and Permissions</h4>
              <div className="row manage-user">
                <div className="col user-list">
                  <RoleList editRole={this.renderRoleForm} deleteRole={this.renderAlert} roles={roles} />
                </div>
                {this.state.displayForm && <div className="col s5">
                  <div>
                    <h6>{this.state.text}</h6>
                    <RoleForm cancel={this.cancelRoleForm} role={this.state.role} />
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
        <ReduxSweetAlert />
      </div>
    );
  }
}

ManangeRolePage.propTypes = {
  loadRoles: PropTypes.func.isRequired,
  deleteRole: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
  swal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
};

/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps(state) {
  console.log(state.manageRoles);
  const { roles } = state.manageRoles;
  return {
    roles
  };
}

export default connect(mapStateToProps,
  { loadRoles, deleteRole, swal, close, addFlashMessage })(ManangeRolePage);
