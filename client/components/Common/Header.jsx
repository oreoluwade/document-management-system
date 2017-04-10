import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../../actions/authenticationAction';
import SearchModal from '../SearchModal/index.jsx';

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.handleSearchModal = this.handleSearchModal.bind(this);
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  handleSearchModal(e) {
    e.preventDefault();
    $('#docsSearchModal').modal('open');
  }

  getLinks({ isAuthenticated, user, isAdmin }) {
    if (isAuthenticated) {
      return (
        <ul>
          <li id="searchClick">
            <a onClick={this.handleSearchModal} className="tooltipped"
            data-position="left" data-delay="50"
            data-tooltip="search for documents">
          <i className="material-icons">search</i></a>
          </li>
          <li><Link to="/dashboard" activeClassName="active">
            <i className="material-icons left">dashboard</i>Dashboard</Link></li>
          <li activeClassName="active">
            <a href="#">Welcome, {user.userName}!</a>
          </li>
          <li activeClassName="active">
            <Link to="/profilepage">Profile</Link>
          </li>
          <li activeClassName="active" id="personalDocs">
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
            <a href="#" activeClassName="active" onClick={this.logout}>Logout</a>
          </li>
        </ul>
      );
    }
    return (
      <ul>
        <li><Link to="/signup" activeClassName="active">Signup</Link></li>
        <li><Link to="/login" activeClassName="active">Login</Link></li>
      </ul>
    );
  }

  render() {
    const navLinks = this.getLinks(this.props);
    return (
      <nav className="blue-grey">
        <div className="nav-wrapper">
          <IndexLink to="/" activeClassName="active">
            <i className="material-icons left">home</i>Home</IndexLink>
          {/* <a href="#" data-activates="mobile-demo" className="button-collapse">
            <i className="material-icons">menu</i>
          </a>*/}
          <ul id="nav-mobile" className="right">
            <li>
              {navLinks}
            </li>
          </ul>
          {/* <ul id="mobile-demo" className="side-nav">
            <li>
              {navLinks}
            </li>
          </ul>*/}
        </div>
        <SearchModal />
      </nav>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

/**
 * @param {object}
 * @returns {object} data
 */
export const mapStateToProps = (state) => {
  const { auth: { isAuthenticated, user } } = state;
  const isAdmin = isAuthenticated && user.userRoleId === 1;
  return {
    isAuthenticated,
    user,
    isAdmin
  };
};

export default connect(mapStateToProps, { logout })(Header);
