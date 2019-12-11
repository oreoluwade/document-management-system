import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="card-panel z-depth-8" id="homecard">
    <h3>DOCUMENT MANAGEMENT SYSTEM</h3>
    <p>Create, Edit and Delete Documents for all purposes</p>
    <Link
      to="about"
      className="btn waves-effect waves-light blue-grey"
    >
      Learn More
    </Link>
  </div>
);

export default HomePage;
