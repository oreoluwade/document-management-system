import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addFlashMessage } from '../../actions/flashMessages';

export default function (ComposedComponent) {
  class Authenticate extends React.Component {
    componentDidMount() {
      if (!this.props.isAuthenticated) {
        this.props.addFlashMessage({
          type: 'error',
          text: 'You need to login to access this page'
        });
        this.props.history.push('/login');
      }
      if (this.props.isAuthenticated && this.props.isAdmin !== 1) {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Only Admin has rights to access this page'
        });
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.props.history.push('/login');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  Authenticate.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    isAdmin: PropTypes.number,
    history: PropTypes.object
  };

  function mapStateToProps(state) {
    let admin;
    if (state.auth.isAuthenticated) {
      admin = state.auth.user.userRoleId;
    }
    return {
      isAuthenticated: state.auth.isAuthenticated,
      isAdmin: admin
    };
  }

  return withRouter(connect(mapStateToProps, { addFlashMessage })(Authenticate));
}
