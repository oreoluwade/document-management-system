import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { loadRoles, deleteRole } from '../../actions/roleActions';
import RoleCard from './role-card';

class Roles extends React.Component {
  state = {
    displayForm: false,
    role: {}
  };

  componentDidMount() {
    this.props.loadRoles();
  }

  renderAlert = id => {
    this.props.swal({
      title: 'Warning!',
      text: 'Are you sure you want to delete role?',
      type: 'info',
      showCancelButton: true,
      onConfirm: () => this.deleteRole(id),
      onCancel: this.props.close
    });
  };

  deleteRole = id => {
    this.props
      .deleteRole(id)
      .then(() => toastr.success('Role Successfully Deleted'))
      .catch(() => {
        toastr.error('Unable to delete role');
      });
  };

  render() {
    const {
      props: { roles }
    } = this;
    return (
      <div className="roles-root">
        <h4 className="center">Manage Role Details and Permissions</h4>
        {roles.map(role => (
          <RoleCard role={role} key={role.id} />
        ))}
      </div>
    );
  }
}

Roles.propTypes = {
  loadRoles: PropTypes.func.isRequired,
  deleteRole: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  return {
    roles: state.admin.roles
  };
};

export default connect(mapStateToProps, {
  loadRoles,
  deleteRole
})(Roles);
