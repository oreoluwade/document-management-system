import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/authenticationAction';
import { searchDocuments } from '../../actions/documentActions';

class Header extends Component {
  logout = (e) => {
    e.preventDefault();
    this.props.logout();
  }

  handleSearch = (e) => {
    const path = window.location.pathname.slice(1);
    if (['dashboard', 'documents'].includes(path)) {
      this.props.searchDocuments(e.target.value);
    }
  }

  getLinks({ isAuthenticated, user, isAdmin }) {
    const path = window.location.pathname.slice(1);
    const enabled = ['dashboard', 'documents'].includes(path);
    if (isAuthenticated) {
      return (
        <ul>
          <li>
            <form className="leftsearchbox">
              <div className="input-field">
                <input
                  disabled={!enabled}
                  id="search"
                  type="search"
                  onChange={this.handleSearch}
                />
                <label
                  htmlFor="search"
                >
                  <i className="mdi mdi-magnify" />
                </label>
              </div>
            </form>
          </li>
          <li>
            <Link
              to="/dashboard"
              activeclassname="active"
            >
              <i className="material-icons left">dashboard</i>Dashboard
            </Link>
          </li>
          <li activeclassname="active">
            <a href="#">Welcome, {user.userName}!</a>
          </li>
          <li activeclassname="active">
            <Link to="/profilepage">Profile</Link>
          </li>
          <li activeclassname="active" id="personalDocs">
            <Link to="/documents">Saved Documents</Link>
          </li>
          {isAdmin &&
            <li className="admin">
              <Link to="/admin/manageroles">Manage Roles</Link>
            </li>
          }
          {isAdmin && <li className="admin" id="adminTab">
            <Link to="/admin/handleusers">Manage Users</Link>
          </li>}
          <li>
            <a href="#" activeclassname="active" onClick={this.logout}>Logout</a>
          </li>
        </ul>
      );
    }
    return (
      <ul>
        <li><Link to="/signup" activeclassname="active">Signup</Link></li>
        <li><Link to="/login" activeclassname="active">Login</Link></li>
      </ul>
    );
  }

  render() {
    const navLinks = this.getLinks(this.props);
    return (
      <nav className="blue-grey">
        <div className="nav-wrapper">
          <Link to="/" activeclassname="active">
            <i className="material-icons left">home</i>Home
          </Link>
          <ul id="nav-mobile" className="right">
            <li>
              {navLinks}
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  searchDocuments: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export const mapStateToProps = (state) => {
  const { auth: { isAuthenticated, user } } = state;
  const isAdmin = isAuthenticated && user.userRoleId === 1;
  return {
    isAuthenticated,
    user,
    isAdmin
  };
};

const enhance = connect(
  mapStateToProps,
  {
    logout,
    searchDocuments
  }
);

export default enhance(Header);
