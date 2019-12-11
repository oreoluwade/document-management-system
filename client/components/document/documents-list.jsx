import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { deleteDocument } from '../../actions';
import DocumentCard from './document-card';

class DocumentList extends Component {
    state = {
        doc: {}
    };

    handleDeleteDocument = id => {
        const {
            user: { id: userId }
        } = this.props;
        const result = confirm('Do you want to delete this docuement?');
        if (result) {
            this.props
                .deleteDocument(id, userId)
                .then(() => toastr.success('Document Successfully Deleted'));
        }
    };

    render() {
        const { documents } = this.props;
        return (
            <div className="doc-collection">
                <Grid container spacing={3}>
                    {documents.map(document => (
                        <Grid item xs={12} sm={4} key={document.id}>
                            <DocumentCard document={document} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

DocumentList.propTypes = {
    deleteDocument: PropTypes.func,
    documents: PropTypes.array,
    user: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user.details
    };
};

export default connect(null, { deleteDocument })(DocumentList);
