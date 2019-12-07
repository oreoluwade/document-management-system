import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadUserDocuments, loadAllDocuments } from '../../actions';

export default function(ComposedComponent) {
  class RequireAuth extends React.Component {
    componentDidMount() {
      if (this.props.isAuthenticated) {
        this.props.loadAllDocuments();
        this.props.loadUserDocuments(this.props.userId);
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.userId !== prevProps.userId) {
        this.props.loadUserDocuments(this.props.userId);
        this.props.loadAllDocuments();
      }
    }

    // componentWillUpdate(nextProps) {
    //   if (!nextProps.isAuthenticated) {
    //     this.props.history.push('/');
    //   }
    // }
    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  RequireAuth.propTypes = {
    isAuthenticated: PropTypes.bool,
    history: PropTypes.object
  };

  const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      userId: state.user.details.id
    };
  };

  return withRouter(
    connect(mapStateToProps, { loadUserDocuments, loadAllDocuments })(
      RequireAuth
    )
  );
}
