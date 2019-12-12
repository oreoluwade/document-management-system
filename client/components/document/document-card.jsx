import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import { formatRelative } from 'date-fns';
import stripHtmlTags from '../../utils/stripHtmlTags';

const useStyles = makeStyles({
    card: {
        minWidth: '80%',
        backgroundColor: '#CDCDCD',
        marginBottom: '0.4rem',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '0.4rem',
        paddingRight: '0.4rem',
        paddingTop: '0.4rem'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    date: {
        color: 'rgb(49, 150, 175)',
        fontSize: 14,
        fontStyle: 'italic'
    },
    titleContent: {
        display: 'flex'
    },
    docContent: {
        fontStyle: 'italic',
        fontSize: '0.8rem'
    },
    footerConent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0px !important'
    },
    action: {
        display: 'flex',
        alignItems: 'center'
    },
    view: {
        color: 'green',
        height: '1.8rem',
        width: '1.8rem'
    },
    delete: {
        height: '1.5rem',
        width: '2rem',
        color: '#8B0000',
        marginBottom: '0.7rem'
    }
});

const DocumentCard = ({ document }) => {
    const classes = useStyles();

    const getDate = document => {
        return formatRelative(new Date(document.createdAt), new Date());
    };

    return (
        <Card className={classes.card}>
            <CardContent className={classes.titleContent}>
                <Typography className={classes.title}>
                    {document.title}
                </Typography>
            </CardContent>
            <CardContent>
                <Typography className={classes.docContent}>
                    {stripHtmlTags(document.content)}
                </Typography>
            </CardContent>
            <CardContent className={classes.footerConent}>
                <Typography className={classes.date}>{`Created ${getDate(
                    document
                )}`}</Typography>
                <div className={classes.action}>
                    <Tooltip title="Delete Document">
                        <DeleteIcon className={classes.delete} />
                    </Tooltip>
                    <Link to={`/document/${document.id}`}>
                        <Tooltip title="View Document">
                            <VisibilityIcon className={classes.view} />
                        </Tooltip>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

DocumentCard.propTypes = {
    document: PropTypes.object.isRequired
};

export default DocumentCard;
