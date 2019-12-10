import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import toastr from 'toastr';
import Grid from '@material-ui/core/Grid';
import { loadRoles, deleteRole } from '../../actions/roleActions';
import RoleCard from './role-card';

class Roles extends React.Component {
    state = {
        displayForm: false,
        role: {}
    };

    componentDidMount() {
        this.props.loadRoles();
    }

    deleteRole = id => {
        this.props
            .deleteRole(id)
            .then(() => toastr.success('Role Successfully Deleted'))
            .catch(() => {
                toastr.error('Unable to delete role');
            });
    };

    render() {
        const {
            props: { roles }
        } = this;
        return (
            <div className="roles-root">
                <h4 className="center">Manage Role Details and Permissions</h4>
                <Grid container spacing={3}>
                    {roles.map(role => (
                        <Grid item xs={6} sm={4} key={role.id}>
                            <RoleCard role={role} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

Roles.propTypes = {
    loadRoles: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    roles: state.admin.roles
});

export default connect(mapStateToProps, {
    loadRoles,
    deleteRole
})(Roles);
