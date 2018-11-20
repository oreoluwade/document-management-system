import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import toastr from 'toastr';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import RoleList from './RoleList';
import { loadRoles, deleteRole } from '../../actions/roleActions';
import { addFlashMessage } from '../../actions/flashMessages';
import RoleForm from './RoleForm';

class ManangeRolePage extends React.Component {
  state = {
    displayForm: false,
    role: {}
  };

  componentDidMount() {
    this.props.loadRoles();
    $('.tooltipped').tooltip({ delay: 50 });
  }

  renderAlert = (id) => {
    this.props.swal({
      title: 'Warning!',
      text: 'Are you sure you want to delete role?',
      type: 'info',
      showCancelButton: true,
      onConfirm: () => this.deleteRole(id),
      onCancel: this.props.close,
    });
  }

  deleteRole = (id) => {
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

  renderRoleForm = (role = {}) => {
    const text = 'Update Role Details';
    this.setState({ displayForm: true, text, role });
  }

  cancelRoleForm = () => {
    this.setState({ displayForm: false, user: {} });
  }

  render() {
    const {
      props: { roles },
      state: { displayForm, role, text },
      renderAlert,
      renderRoleForm,
      cancelRoleForm,
    } = this;
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <div className="col s12 z-depth-5 card-panel card-body">
              <h4 className="center">Manage Role Details and Permissions</h4>
              <div className="row manage-user">
                <div className="col user-list">
                  <RoleList editRole={renderRoleForm} deleteRole={renderAlert} roles={roles} />
                </div>
                {displayForm && <div className="col s5">
                  <div>
                    <h6>{text}</h6>
                    <RoleForm cancel={cancelRoleForm} role={role} />
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
  addFlashMessage: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { roles } = state.manageRoles;
  return {
    roles
  };
}

export default connect(mapStateToProps, {
  loadRoles,
  deleteRole,
  swal,
  close,
  addFlashMessage
})(ManangeRolePage);
