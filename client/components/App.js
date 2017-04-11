// This component handles the App template used on every page.
import React, { PropTypes } from 'react';
import Header from './Common/Header.jsx';
import FlashMessagesList from './FlashMessagesList/index.jsx';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header location={this.props.location}/>
        <FlashMessagesList />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
};

export default App;
