import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { retrieveUsers } from '../../actions';
import UserCard from './user-card';
import './index.scss';

const Users = props => {
    useEffect(() => {
        props.retrieveUsers();
    }, []);

    return (
        <div className="users-root">
            <h4 className="center">Manage Users</h4>
            <Grid container spacing={3}>
                {props.users.map(user => (
                    <Grid item xs={6} sm={3} key={user.id}>
                        <UserCard user={user} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

Users.propTypes = {
    retrieveUsers: PropTypes.func.isRequired,
    users: PropTypes.array
};

const mapStateToProps = state => ({
    users: state.admin.users
});

export default connect(mapStateToProps, {
    retrieveUsers
})(Users);
