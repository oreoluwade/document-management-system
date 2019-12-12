import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { loadRoles } from '../../actions/roleActions';
import RoleCard from './role-card';
import CreateRole from './create-role';

const Roles = props => {
    useEffect(() => {
        props.loadRoles();
    }, []);

    return (
        <div className="roles-root">
            <h4 className="center">Manage Roles</h4>
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
