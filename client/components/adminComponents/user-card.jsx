import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { deleteUser } from '../../actions';

const useStyles = makeStyles({
    cardRoot: {
        minWidth: 275
    },
    name: {
        fontSize: 14
    },
    email: {
        fontSize: 14,
        color: 'rgb(49, 150, 175)'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    delete: {
        height: '1.5rem',
        width: '2rem',
        color: '#8B0000'
    },
    action: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

const UserCard = ({ user, deleteUser }) => {
    const classes = useStyles();

    const destroyUser = async userId => {
        await deleteUser(userId);
    };

    return (
        <Card className={classes.cardRoot}>
            <CardContent className={classes.cardHeader}>
                <Typography className={classes.name} color="textSecondary">
                    {user.firstname} {user.lastname}
                </Typography>
                <Typography className={classes.email}>{user.email}</Typography>
            </CardContent>
            <CardContent className={classes.action}>
                <Tooltip title={`Delete ${user.firstname} ${user.lastname}`}>
                    <DeleteIcon
                        className={classes.delete}
                        onClick={() => destroyUser(user.id)}
                    />
                </Tooltip>
            </CardContent>
        </Card>
    );
};

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
    deleteUser: PropTypes.func.isRequired
};

export default connect(null, { deleteUser })(UserCard);
