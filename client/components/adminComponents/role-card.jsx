import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { formatDate } from '../../utils';
import { deleteRole } from '../../actions';

const useStyles = makeStyles({
    delete: {
        height: '1.5rem',
        width: '2rem',
        color: '#8B0000'
    },
    action: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

const RoleCard = ({ role, deleteRole }) => {
    const classes = useStyles();

    const destroyRole = roleId => {
        deleteRole(roleId);
    };

    return (
        <Card className="role-card">
            <CardContent className="role-card__header">
                <Typography className="role-title__wrapper">
                    title: <span className="role-title">{role.title}</span>
                </Typography>
                <Typography className="role-id__wrapper">
                    ID: <span className="role-id">{role.id}</span>
                </Typography>
            </CardContent>
            <CardContent className={classes.action}>
                <Typography className="role-date">
                    {`Created ${formatDate(role)}`}
                </Typography>
                {role.id !== 1 && (
                    <Tooltip title={`Delete ${role.title}`}>
                        <DeleteIcon
                            className={classes.delete}
                            onClick={() => destroyRole(role.id)}
                        />
                    </Tooltip>
                )}
            </CardContent>
        </Card>
    );
};

RoleCard.propTypes = {
    role: PropTypes.object.isRequired,
    deleteRole: PropTypes.func
};

export default connect(null, { deleteRole })(RoleCard);
