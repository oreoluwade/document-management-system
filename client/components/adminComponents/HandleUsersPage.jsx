import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import toastr from 'toastr';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import UserList from './UserList';
import { retrieveUsers, deleteUser } from '../../actions/userActions';
import { addFlashMessage } from '../../actions/flashMessages';
import UserForm from './UserForm';

class HandleUsersPage extends React.Component {
  state = {
    text: '',
    displayForm: false,
    user: {}
  };

  componentDidMount() {
    this.props.retrieveUsers();
    $('.tooltipped').tooltip({ delay: 50 });
  }

  renderAlert = (id) => {
    this.props.swal({
      title: 'Warning!',
      text: 'Are you sure you want to delete user?',
      type: 'info',
      showCancelButton: true,
      onConfirm: () => this.deleteUser(id),
      onCancel: this.props.close,
    });
  }

  deleteUser = (id) => {
    this.props.deleteUser(id)
      .then(() => toastr.success('User Successfully Deleted'))
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Unable to delete user'
        });
        toastr.error('Unable to delete user');
      });
  }

  renderUserForm = (user = {}) => {
    const text = 'Update User Details';
    this.setState(() => ({
      displayForm: true,
      text,
      user
    }));
  }

  cancelUserForm = () => {
    this.setState(() => ({ displayForm: false, user: {} }));
  }

  render() {
    const {
      state: { displayForm, user, text },
      props: { users },
      cancelUserForm,
      renderUserForm,
      renderAlert
    } = this;

    return (
      <div>
        <div className="row">
          <div className="col s12">
            <div className="col s12 z-depth-5 card-panel card-body">
              <h4 className="center">Manage User Details and Permissions</h4>
              <div className="row manage-user">
                <div className="col user-list">
                  <UserList editUser={renderUserForm} deleteUser={renderAlert} users={users} />
                </div>
                {displayForm && <div className="col s5">
                  <div>
                    <h6>{text}</h6>
                    <UserForm cancel={cancelUserForm} user={user} />
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

HandleUsersPage.propTypes = {
  retrieveUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  swal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  users: PropTypes.array,
};

function mapStateToProps(state) {
  const { users } = state.handleUsers;
  return {
    users,
  };
}

export default connect(mapStateToProps, {
  retrieveUsers,
  deleteUser,
  swal,
  close,
  addFlashMessage
})(HandleUsersPage);

