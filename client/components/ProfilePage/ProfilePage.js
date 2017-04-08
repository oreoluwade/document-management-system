/* eslint class-methods-use-this: "off"*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReduxSweetAlert, { swal, close } from 'react-redux-sweetalert';
import { updateUserInfo, getUserInfo } from '../../actions/userActions';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  componentDidMount() {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  componentWillReceiveProps() {
    this.props.getUserInfo();
  }

  handleOnChange(event) {
    const field = event.target.name;
    const value = event.target.value;
    return this.setState({
      [field]: value
    });
  }

  submitData() {
    const userInfo = this.state;
    return this.props.updateUserInfo(userInfo);
  }

  renderAlert() {
    this.props.swal({
      title: 'Are you sure you want to update your details?',
      text: 'yes',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      onConfirm: () => this.submitData(),
      onCancel: this.props.close,
    });
  }

  render() {
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
                                value={this.state.firstName}
                                className="validate"
                                onChange={this.handleOnChange}
                              />
                              <label htmlFor="first_name">First Name</label>
                            </div>
                            <div className="input-field col s6">
                              <input
                                id="last_name"
                                name="lastName"
                                type="text"
                                value={this.state.lastName}
                                className="validate"
                                onChange={this.handleOnChange}
                              />
                              <label htmlFor="last_name">Last Name</label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="input-field col s6">
                              <input
                                id="userName"
                                type="text"
                                name="userName"
                                value={this.state.userName}
                                onChange={this.handleOnChange}
                                className="validate"
                              />
                              <label htmlFor="first_name">Username</label>
                            </div>
                            <div className="input-field col s6">
                              <input
                                id="email"
                                type="email"
                                value={this.state.email}
                                name="email"
                                onChange={this.handleOnChange}
                                className="validate"
                              />
                              <label htmlFor="email">Email</label>
                            </div>
                            <div className="row">
                              <div className="col s6">
                                <button
                                  className="btn waves-effect waves-light"
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
    swal,
    close
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
