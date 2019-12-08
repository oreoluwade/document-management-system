import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from './Common/Navbar';
import routes from '../routes';
import CreateDocumentButton from './Common/create-document-button';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app-root">
          <Navbar />
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
          <CreateDocumentButton />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  children: PropTypes.object
};

export default App;
