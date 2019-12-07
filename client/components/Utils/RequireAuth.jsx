import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
  class RequireAuth extends React.Component {
    componentDidMount() {
      if (!this.props.isAuthenticated) {
        this.props.history.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.props.history.push('/');
      }
    }
    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  RequireAuth.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    history: PropTypes.object
  };

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated
    };
  }

  return withRouter(connect(mapStateToProps, null)(RequireAuth));
}
