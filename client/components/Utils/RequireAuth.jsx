import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
    class RequireAuth extends React.Component {
        render() {
            return this.props.isAuthenticated ? (
                <ComposedComponent {...this.props} />
            ) : (
                <Redirect to="/login" />
            );
        }
    }

    RequireAuth.propTypes = {
        isAuthenticated: PropTypes.bool,
        history: PropTypes.object
    };

    const mapStateToProps = state => ({
        isAuthenticated: state.auth.isAuthenticated
    });

    return withRouter(connect(mapStateToProps, null)(RequireAuth));
}
