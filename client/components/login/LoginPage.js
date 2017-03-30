import React from 'react';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col s12">
          <LoginForm />
        </div>
      </div>
    );
  }
}

export default LoginPage;
