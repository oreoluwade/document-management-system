import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { retrieveUsers } from '../../actions';
import UserCard from './user-card';
import './index.scss';

const useStyles = makeStyles({
    root: {
        overflow: 'scroll',
        height: '80%',
        backgroundColor: 'whitesmoke',
        paddingRight: '2rem',
        paddingLeft: '2rem',
        marginTop: '2rem'
    }
});

const Users = props => {
    const classes = useStyles();

    useEffect(() => {
        props.retrieveUsers();
    }, []);

    return (
        <div className={classes.root}>
            <h1>Manage Users</h1>
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
