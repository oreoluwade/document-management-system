/* eslint class-methods-use-this: "off"*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import UsersList from '../AdminPage/UsersList.jsx';
import { getUserById } from '../../actions/userActions';
import UsersForm from '../AdminPage/UsersForm.jsx';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayForm: false,
      user: {}
    };
    this.cancelUsersForm = this.cancelUsersForm.bind(this);
    this.renderUsersForm = this.renderUsersForm.bind(this);
  }

  // componentWillMount() {
  // }

  componentDidMount() {
    this.props.getUserById();
    $('.tooltipped').tooltip({ delay: 50 });
  }

  renderUsersForm(user = {}) {
    const text = 'Update Your Details';
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
              <h4 className="center">Edit Your Details</h4>
              <div className="row manage-user">
                <div className="col user-list">
                  <UsersList
                    editUser={this.renderUsersForm}
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


ProfilePage.propTypes = {
  close: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { getUserById, swal, close, })(ProfilePage);
