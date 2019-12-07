import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { deleteDocument } from '../../actions/documentActions';
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
        {documents.map(document => (
          <DocumentCard document={document} key={document.id} />
        ))}
      </div>
    );
  }
}

DocumentList.propTypes = {
  deleteDocument: PropTypes.func,
  docs: PropTypes.array,
  showModal: PropTypes.func,
  user: PropTypes.object
};

export default connect(null, { deleteDocument })(DocumentList);
