import React from 'react';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="col s5">
          <LoginForm />
        </div>
      </div>
    );
  }
}

export default LoginPage;
