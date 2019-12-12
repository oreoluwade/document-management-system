import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { formatDate } from '../../utils';

const useStyles = makeStyles({
    card: {
        minWidth: 275
    },
    title: {
        fontSize: 14
    }
});

const RoleCard = ({ role }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className="role-title__wrapper">
                    Role Name: <span className="role-title">{role.title}</span>
                </Typography>
            </CardContent>
            <CardContent>
                <Typography className="role-date">
                    {`Created ${formatDate(role)}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

RoleCard.propTypes = {
    role: PropTypes.object.isRequired
};

export default RoleCard;
