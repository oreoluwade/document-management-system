import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { retrieveUsers, deleteUser } from '../../actions';
import UserCard from './user-card';
import './index.scss';

class Users extends React.Component {
  state = {
    text: '',
    user: {}
  };

  componentDidMount() {
    this.props.retrieveUsers();
  }

  handleDeleteUser = id => {
    this.props
      .deleteUser(id)
      .then(() => toastr.success('User Successfully Deleted'))
      .catch(() => {
        toastr.error('Unable to delete user');
      });
  };

  render() {
    const {
      props: { users }
    } = this;

    return (
      <div className="users-root">
        <h4 className="center">Manage User Details and Permissions</h4>
        {users.map(user => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    );
  }
}

Users.propTypes = {
  retrieveUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  users: PropTypes.array
};

const mapStateToProps = state => {
  return {
    users: state.admin.users
  };
};

export default connect(mapStateToProps, {
  retrieveUsers,
  deleteUser
})(Users);
