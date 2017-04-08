/* eslint class-methods-use-this: "off"*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import UsersList from './UsersList.jsx';
import { retrieveUsers, deleteUser } from '../../actions/userActions';
import UsersForm from './UsersForm.jsx';

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayForm: false,
      user: {}
    };
    this.cancelUsersForm = this.cancelUsersForm.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.renderUsersForm = this.renderUsersForm.bind(this);
  }

  componentWillMount() {
    this.props.retrieveUsers();
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
      onConfirm: () => this.deleteUser(id),
      onCancel: this.props.close,
    });
  }

  deleteUser(id) {
    this.props.deleteUser(id)
      .then(() => toastr.success('User Successfully Deleted'))
      .catch(() => {
        toastr.error(
          'Unable to delete user');
      });
  }

  renderUsersForm(user = {}) {
    const text = 'Update User Details';
    this.setState({ displayForm: true, text, user });
  }

  cancelUsersForm() {
    this.setState({ displayForm: false, user: {} });
  }

  render() {
    const { users } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <div className="col s12 z-depth-5 card-panel card-body">
              <h4 className="center">Manage User Details and Permissions</h4>
              <div className="row manage-user">
                <div className="col user-list">
                  <UsersList
                    editUser={this.renderUsersForm}
                    deleteUser={this.renderAlert}
                    users={users}
                  />
                </div>
                {this.state.displayForm && <div className="col s5">
                  <div>
                    <h6>{this.state.text}</h6>
                    <UsersForm
                      cancel={this.cancelUsersForm}
                      user={this.state.user}
                    />
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


UsersPage.propTypes = {
  close: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  retrieveUsers: PropTypes.func.isRequired,
  swal: PropTypes.func.isRequired,
  users: React.PropTypes.array.isRequired,
};


/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps(state) {
  const { users } = state.handleUsers;
  return {
    users,
  };
}

export default connect(mapStateToProps, { retrieveUsers, deleteUser, swal, close, })(UsersPage);

