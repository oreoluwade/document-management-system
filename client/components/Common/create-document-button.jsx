import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const CreateDocumentButton = ({ location }) => {
  const unincludedPaths = ['/render-document'];

  const isVisible = !unincludedPaths.includes(location.pathname);

  return isVisible ? (
    <Link to="/render-document">
      <AddCircleIcon className="create-document__button" />
    </Link>
  ) : null;
};

CreateDocumentButton.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

export default withRouter(connect(mapStateToProps, null)(CreateDocumentButton));
