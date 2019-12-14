import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { deleteDocument } from '../../actions';
import DocumentCard from './document-card';

const DocumentList = ({ documents }) => {
    return (
        <div className="doc-collection">
            <Grid container spacing={3}>
                {documents.map(document => (
                    <Grid item xs={12} sm={3} key={document.id}>
                        <DocumentCard document={document} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

DocumentList.propTypes = {
    documents: PropTypes.array.isRequired
};

export default connect(null, { deleteDocument })(DocumentList);
