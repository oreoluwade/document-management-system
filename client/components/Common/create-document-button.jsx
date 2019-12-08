import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';

const CreateDocumentButton = ({ location }) => {
  const unincludedPaths = ['/render-document', '/documents', '/'];

  const isVisible = !unincludedPaths.includes(location.pathname);

  return isVisible ? (
    <Link to="/render-document">
      <Tooltip title="Create New Document">
        <AddCircleIcon className="create-document__button" />
      </Tooltip>
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
