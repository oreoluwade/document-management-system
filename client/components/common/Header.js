import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

const Header = () => (
  <nav blue>
    <div className="nav-wrapper">
      <IndexLink to="/" activeClassName="active">Home</IndexLink>
      {' | '}
      <Link to="/signup" activeClassName="active">SignUp</Link>
      {' | '}
      <Link to="/login" activeClassName="active">Login</Link>
      </div>
    </nav>
  );

export default Header;
