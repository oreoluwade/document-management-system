import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { loadAllDocuments } from '../../actions';
import DocumentCard from './document-card';
import SelectAccess from './select-access';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        height: '80%',
        overflow: 'scroll',
        backgroundColor: 'whitesmoke'
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    },
    accessFilter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    filterText: {
        marginRight: theme.spacing(3)
    }
}));

const filterDocuments = (checkedState, documents) => {
    const categoriesIncluded = Object.keys(checkedState).filter(
        cat => !!checkedState[cat]
    );

    if (categoriesIncluded.length === 0) {
        return documents;
    } else {
        return documents.filter(doc => categoriesIncluded.includes(doc.access));
    }
};

const Documents = ({ allDocuments, loadAllDocuments }) => {
    const classes = useStyles();
    const [documents, setDocuments] = useState([]);
    const [checkedState, setCheckedState] = useState({
        public: false,
        private: false,
        role: false
    });

    useEffect(() => {
        loadAllDocuments().then(() => {
            setDocuments(allDocuments);
        });
    }, []);

    useEffect(() => {
        const filteredDocuments = filterDocuments(checkedState, allDocuments);
        setDocuments(filteredDocuments);
    }, [checkedState]);

    useEffect(() => {
        setDocuments(allDocuments);
    }, [allDocuments]);

    const handleChecked = event => {
        setCheckedState({
            ...checkedState,
            [event.target.name]: event.target.checked
        });
    };

    return (
        <div className={classes.root}>
            <div className={classes.accessFilter}>
                <h4 className={classes.filterText}>Filter: </h4>
                <SelectAccess
                    publicChecked={checkedState.public}
                    privateChecked={checkedState.private}
                    roleChecked={checkedState.role}
                    handleChecked={handleChecked}
                />
            </div>
            <Grid container spacing={2}>
                {documents.map(document => (
                    <Grid item xs={6} sm={3} key={document.id}>
                        <DocumentCard document={document} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

Documents.propTypes = {
    auth: PropTypes.object,
    loadAllDocuments: PropTypes.func,
    allDocuments: PropTypes.array
};

const mapStateToProps = state => {
    const { documents, auth } = state;

    return {
        auth,
        allDocuments: documents
    };
};

export default connect(mapStateToProps, { loadAllDocuments })(Documents);
