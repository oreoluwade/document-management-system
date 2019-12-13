import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import stripHtmlTags from '../../utils/stripHtmlTags';
import { formatDate } from '../../utils';
import { deleteDocument } from '../../actions';

const useStyles = makeStyles({
    card: {
        minWidth: '80%',
        backgroundColor: '#CDCDCD',
        marginBottom: '0.4rem',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '0.4rem',
        paddingRight: '0.4rem',
        paddingTop: '0.4rem',
        height: '15rem'
    },
    titleCard: {
        paddingBottom: 0
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    content: {
        height: '15rem',
        overflow: 'hidden',
        fontStyle: 'italic',
        fontSize: '0.8rem',
        paddingTop: '8px'
    },
    date: {
        color: 'rgb(49, 150, 175)',
        fontSize: 14,
        fontStyle: 'italic'
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
        marginBottom: '0.4rem'
    }
});

const DocumentCard = ({ document, deleteDocument, userId }) => {
    const classes = useStyles();

    const discardDocument = async documentId => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(80, 143, 202)',
            cancelButtonColor: '#8B0000',
            confirmButtonText: 'Yes, delete it!'
        }).then(async result => {
            if (result.value) {
                await deleteDocument(userId, documentId);
                Swal.fire({
                    title: 'Document deleted',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    return (
        <Card className={classes.card}>
            <CardContent className={classes.titleCard}>
                <Typography className={classes.title}>
                    {document.title}
                </Typography>
            </CardContent>
            <CardContent className={classes.content}>
                <Typography>{stripHtmlTags(document.content)}</Typography>
            </CardContent>
            <CardContent className={classes.footerConent}>
                <Typography className={classes.date}>
                    {`Created ${formatDate(document)}`}
                </Typography>
                <div className={classes.action}>
                    {userId === document.ownerId && (
                        <Tooltip title="Delete Document">
                            <DeleteIcon
                                className={classes.delete}
                                onClick={() => discardDocument(document.id)}
                            />
                        </Tooltip>
                    )}
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
    document: PropTypes.object.isRequired,
    deleteDocument: PropTypes.func,
    userId: PropTypes.number
};

const mapStateToProps = state => {
    return {
        userId: state.user.details.id
    };
};

export default connect(mapStateToProps, { deleteDocument })(DocumentCard);
