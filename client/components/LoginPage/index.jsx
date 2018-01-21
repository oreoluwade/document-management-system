import React, { Component } from 'react';
import LoginForm from './LoginForm';

class LoginPage extends Component {
  render() {
    return (
      <div className="card" id="logincard">
        <LoginForm />
      </div>
    );
  }
}

export default LoginPage;
