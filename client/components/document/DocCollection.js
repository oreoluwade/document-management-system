import React from 'react';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as documentActions from '../../actions/documentActions';

class DocCollection extends React.Component {
  constructor(props) {
    super(props);
    this.renderModal = this.renderModal.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.addNewDocument = this.addNewDocument.bind(this);
  }

  componentDidMount() {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  renderModal(id) {
    console.log(id)
    this.props.actions.chooseAsCurrentDocument(id);
    $('#docDisplayModal').modal('open');
  }

  addNewDocument(e) {
    e.preventDefault();
    $('#docDisplayModal').modal('open');
  }

  deleteDocument(e) {
    e.preventDefault();
    const documentId = e.target.id;
    const result = confirm('Do you want to delete this docuement?');
    if (result) {
      this.props.actions.deleteDocument(documentId)
        .then(() => toastr.success('Document Successfully Deleted'));
    }
  }

  render() {
    return (
      <div>
        {this.props.documents
          .map(document => <div id="card-panel" className="card white"
            key={document.id}
            onClick={() => this.renderModal(document.id)}>
            <div className="card-content grey-text">
              <a className="pointer tooltipped"
                data-position="bottom"
                data-delay="50"
                data-tooltip="Click to view content"
              >
                Title: {document.title}
                <span className="badge list-badge">
                  Access: {document.access}</span>
              </a>
            </div>
          </div>)}
        <div className="action-buttons">
          <div className="menu-action-buttons fixed-action-btn horizontal click-to-toggle">
            <a className="btn-floating btn-large tooltipped"
              data-position="top" data-delay="50"
              data-tooltip="Click to show other buttons"
            >
              <i className="material-icons">menu</i>
            </a>
            <ul>
              <li onClick={this.editDocument} className="editDoc">
                <a href="#docDisplayModal"
                  className="btn-floating green tooltipped"
                  data-position="top" data-delay="50"
                  data-tooltip="edit document">
                  <i id={document.id} className="material-icons">mode_edit</i>
                </a>
              </li>
              <li onClick={this.deleteDocument}>
                <a className="btn-floating red darken-1 tooltipped"
                  data-position="top" data-delay="50"
                  data-tooltip="delete document"
                >
                  <i id={document.id} className="material-icons">delete_forever</i>
                </a>
              </li>
            </ul>
          </div>
          <div className="fixed-action-btn horizontal">
            <a className="btn-floating btn-large tooltipped"
              data-position="top" data-delay="50"
              data-tooltip="create new document"
              onClick={this.addNewDocument}
            >
              <i className="material-icons">note_add</i>
            </a>
          </div>
        </div>

      </div>
    );
  }
}

DocCollection.propTypes = {
  documents: React.PropTypes.array.isRequired,
  actions: React.PropTypes.object.isRequired
};

/**
 * @param {any} dispatch
 * @returns {any}
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(documentActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(DocCollection);
