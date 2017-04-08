/* eslint class-methods-use-this: "off"*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import RolesList from './RolesList.jsx';
import { loadRoles, deleteRole } from '../../actions/roleActions';
import RolesForm from './RolesForm.jsx';

class RolesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayForm: false,
      role: {}
    };
    this.renderAlert = this.renderAlert.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
    this.cancelRolesForm = this.cancelRolesForm.bind(this);
    this.renderRolesForm = this.renderRolesForm.bind(this);
  }

  componentWillMount() {
    this.props.loadRoles();
  }

  componentDidMount() {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  renderAlert(id) {
    this.props.swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      onConfirm: () => this.deleteRole(id),
      onCancel: this.props.close,
    });
  }

  deleteRole(id) {
    this.props.deleteRole(id)
      .then(() => toastr.success('Role Successfully Deleted'))
      .catch(() => {
        toastr.error('Unable to delete role');
      });
  }

  renderRolesForm(role = {}) {
    const text = 'Update Role Details';
    this.setState({ displayForm: true, text, role });
  }

  cancelRolesForm() {
    this.setState({ displayForm: false, user: {} });
  }

  render() {
    const { roles } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <div className="col s12 z-depth-5 card-panel card-body">
              <h4 className="center">Manage Roles</h4>
              <div className="row manage-user">
                <div className="col user-list">
                  <RolesList
                    editRole={this.renderRolesForm}
                    deleteRole={this.renderAlert}
                    roles={roles}
                  />
                </div>
                {this.state.displayForm && <div className="col s5">
                  <div>
                    <h6>{this.state.text}</h6>
                    <RolesForm cancel={this.cancelRolesForm} role={this.state.role} />
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

RolesPage.propTypes = {
  close: PropTypes.func.isRequired,
  deleteRole: PropTypes.func.isRequired,
  loadRoles: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
  swal: PropTypes.func.isRequired,
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
  { loadRoles, deleteRole, swal, close })(RolesPage);
