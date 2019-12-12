import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TabsPanel from '../dashboard/tabs-panel';
import { loadAllDocuments } from '../../actions';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        height: '80%',
        overflow: 'scroll'
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    }
}));

const Documents = ({
    privateDocuments,
    publicDocuments,
    roleDocuments,
    loadAllDocuments
}) => {
    const classes = useStyles();

    useEffect(() => {
        loadAllDocuments();
    }, []);

    return (
        <div className={classes.root}>
            <TabsPanel
                privateDocuments={privateDocuments}
                publicDocuments={publicDocuments}
                roleDocuments={roleDocuments}
            />
        </div>
    );
};

Documents.propTypes = {
    auth: PropTypes.object,
    privateDocuments: PropTypes.array.isRequired,
    roleDocuments: PropTypes.array.isRequired,
    publicDocuments: PropTypes.array.isRequired,
    loadAllDocuments: PropTypes.func
};

const filterDocument = (category, documents) => {
    return documents.filter(doc => doc.access === category);
};

const mapStateToProps = state => {
    const { documents, auth } = state;
    const publicDocuments = filterDocument('public', documents);
    const roleDocuments = filterDocument('role', documents);
    const privateDocuments = filterDocument('private', documents);

    return {
        auth,
        publicDocuments,
        roleDocuments,
        privateDocuments
    };
};

export default connect(mapStateToProps, { loadAllDocuments })(Documents);
