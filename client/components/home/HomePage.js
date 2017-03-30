import React from 'react';
import { Link } from 'react-router';

class HomePage extends React.Component {
  render() {
    return (
      <div className="card-panel" id="homecard">
        <h3>DOCUMENT MANAGEMENT SYSTEM</h3>
        <p>Create, Edit and Delete Documents for all purposes</p>
        <Link to="about" className="btn waves-effect waves-light blue">Learn More</Link>
      </div>
    );
  }
}

export default HomePage;
