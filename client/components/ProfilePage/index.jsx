import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserInfo } from '../../actions';

const localStorageUser = JSON.parse(localStorage.getItem('user'));

class ProfilePage extends React.Component {
  state = {
    user: this.props.user || localStorageUser || {}
  };

  componentDidMount() {
    this.props.getUserInfo();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user
    });
  }

  handleInputChange = event => {
    const { name: field, value } = event.target;
    return this.setState(state => {
      const user = Object.assign({}, state.user, { [field]: value });
      return { user };
    });
  };

  handleDataSubmit = () => {
    const userInfo = this.state.user;
    return this.props.updateUserInfo(userInfo);
  };

  render() {
    const {
      state: {
        user: { firstname = '', lastname = '', username = '', email = '' }
      },
      handleInputChange
    } = this;

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
                            id="firstname"
                            type="text"
                            name="firstname"
                            value={firstname}
                            className="validate"
                            onChange={handleInputChange}
                          />
                          <label className="active" htmlFor="firstname">
                            First Name
                          </label>
                        </div>
                        <div className="input-field col s6">
                          <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            value={lastname}
                            className="validate"
                            onChange={handleInputChange}
                          />
                          <label className="active" htmlFor="lastname">
                            Last Name
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="input-field col s6">
                          <input
                            id="username"
                            type="text"
                            name="username"
                            value={username}
                            onChange={handleInputChange}
                            className="validate"
                          />
                          <label className="active" htmlFor="first_name">
                            Username
                          </label>
                        </div>
                        <div className="input-field col s6">
                          <input
                            id="email"
                            type="email"
                            value={email}
                            name="email"
                            onChange={handleInputChange}
                            className="validate"
                          />
                          <label className="active" htmlFor="email">
                            Email
                          </label>
                        </div>
                        <div className="row">
                          <div className="col s6">
                            <button
                              className="btn waves-effect blue-grey"
                              type="button"
                              onClick={() => {
                                console.log('Show stuff');
                              }}
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
      </div>
    );
  }
}

ProfilePage.propTypes = {
  user: PropTypes.object,
  updateUserInfo: PropTypes.func,
  close: PropTypes.func
};

const mapStateToProps = ({ user }) => {
  return {
    user
  };
};

export default connect(mapStateToProps, { getUserInfo })(ProfilePage);
