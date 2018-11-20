import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Common/Header';
import FlashMessagesList from './FlashMessagesList/index';
import routes from '../routes';

class App extends React.Component {
  render() {
    console.log('here');
    return (
      <BrowserRouter>
        <React.Fragment>
          <Header location={this.props.location}/>
          <Switch>
            {routes.map(({ component, exact, path }, index) => (
              <Route
                key={index}
                exact={exact}
                component={component}
                path={path}
              />
            ))}
          </Switch>
        </React.Fragment>
        {/* <FlashMessagesList />
        {this.props.children} */}
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  location: PropTypes.object,
  children: PropTypes.object
};

export default App;
