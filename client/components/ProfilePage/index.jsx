import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import { updateUserInfo, getUserInfo } from '../../actions/userActions';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem('user'));
    this.state = {
      user: props.user || user || {}
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  componentWillMount() {
    this.props.getUserInfo();
    $('.tooltipped').tooltip({ delay: 50 });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user
    });
  }

  handleOnChange(event) {
    const { name: field, value } = event.target;
    return this.setState((state) => {
      const user = Object.assign({}, state.user, { [field]: value });
      return { user };
    });
  }

  submitData() {
    const userInfo = this.state.user;
    return this.props.updateUserInfo(userInfo);
  }

  renderAlert() {
    this.props.swal({
      title: 'Are you sure you want to update your details?',
      text: 'yes',
      type: 'warning',
      showCancelButton: true,
      onConfirm: this.submitData,
      onCancel: this.props.close,
    });
  }

  render() {
    const { firstName = '', lastName = '', userName = '', email = '' } = this.state.user;
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <div className="col s12 z-depth-5 card-panel card-body">
              <h4 className="center">Edit Your Details</h4>
              <div className="row manage-user">
                <div className="col user-list">
                  <div className="row">
                    <form className="col s12">
                      <div className="row">
                        <div className="input-field col s6">
                          <input
                            id="first_name"
                            type="text"
                            name="firstName"
                            value={firstName}
                            className="validate"
                            onChange={this.handleOnChange}
                          />
                          <label className="active" htmlFor="first_name">First Name</label>
                        </div>
                        <div className="input-field col s6">
                          <input
                            id="last_name"
                            name="lastName"
                            type="text"
                            value={lastName}
                            className="validate"
                            onChange={this.handleOnChange}
                          />
                          <label className="active" htmlFor="last_name">Last Name</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="input-field col s6">
                          <input
                            id="userName"
                            type="text"
                            name="userName"
                            value={userName}
                            onChange={this.handleOnChange}
                            className="validate"
                          />
                          <label className="active" htmlFor="first_name">Username</label>
                        </div>
                        <div className="input-field col s6">
                          <input
                            id="email"
                            type="email"
                            value={email}
                            name="email"
                            onChange={this.handleOnChange}
                            className="validate"
                          />
                          <label className="active" htmlFor="email">Email</label>
                        </div>
                        <div className="row">
                          <div className="col s6">
                            <button
                              className="btn waves-effect blue-grey"
                              type="button"
                              onClick={() => this.renderAlert()}
                            >
                              Update
                                </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
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
  user: PropTypes.object,
  updateUserInfo: PropTypes.func,
  getUserInfo: PropTypes.func,
  close: PropTypes.func,
  swal: PropTypes.func
};


/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps(state) {
  const { user } = state.handleUsers;
  return {
    user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateUserInfo: bindActionCreators(updateUserInfo, dispatch),
    getUserInfo: bindActionCreators(getUserInfo, dispatch),
    swal: bindActionCreators(swal, dispatch),
    close: bindActionCreators(close, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
