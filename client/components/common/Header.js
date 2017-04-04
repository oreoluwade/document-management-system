import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../../actions/authenticationAction';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.logout = this.logout.bind(this);
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    const userLinks = (
      <ul>
        <li><Link to="/dashboard" activeClassName="active">
          <i className="material-icons left">dashboard</i>D A S H B O A R D</Link></li>
        <li><a href="#" activeClassName="active" onClick={this.logout}>L O G O U T</a></li>
      </ul>
    );

    const guestLinks = (
      <ul>
        <li><Link to="/signup" activeClassName="active">S I G N U P</Link></li>
        <li><Link to="/login" activeClassName="active">L O G I N</Link></li>
      </ul>
    );

    return (
      <nav className="blue-grey">
        <div className="nav-wrapper">
          <IndexLink to="/" activeClassName="active">
            <i className="material-icons left">home</i>H O M E</IndexLink>
          {/* <a href="#" data-activates="mobile-demo" className="button-collapse">
            <i className="material-icons">menu</i>
          </a>*/}
          <ul id="nav-mobile" className="right">
            <li>
              {isAuthenticated ? userLinks : guestLinks}
            </li>
          </ul>
          <ul id="mobile-demo" className="side-nav">
            <li>
              {isAuthenticated ? userLinks : guestLinks}
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  auth: React.PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { logout })(Header);
