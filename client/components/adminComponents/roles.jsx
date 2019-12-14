import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { loadRoles } from '../../actions/roleActions';
import RoleCard from './role-card';
import CreateRole from './create-role';

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

const Roles = props => {
    const classes = useStyles();

    useEffect(() => {
        props.loadRoles();
    }, []);

    return (
        <div className={classes.root}>
            <h1 className="center">Manage Roles</h1>
            <CreateRole />
            <Grid container spacing={3}>
                {props.roles.map(role => (
                    <Grid item xs={6} sm={3} key={role.id}>
                        <RoleCard role={role} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

Roles.propTypes = {
    loadRoles: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    roles: state.admin.roles
});

export default connect(mapStateToProps, {
    loadRoles
})(Roles);
