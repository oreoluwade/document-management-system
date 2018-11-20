import React, { Component, PropTypes } from 'react';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { deleteDocument } from '../../actions/documentActions';

class DocumentList extends Component {
  constructor() {
    super();
    this.state = {
      doc: {}
    };
    this.deleteDocument = this.deleteDocument.bind(this);
  }

  componentDidMount() {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  deleteDocument(id) {
    const { user: { id: userId } } = this.props;
    const result = confirm('Do you want to delete this docuement?');
    if (result) {
      this.props.deleteDocument(id, userId)
        .then(() => toastr.success('Document Successfully Deleted'));
    }
  }

  render() {
    const { docs } = this.props;
    return (
      <div className="doc-collection">
        <ul className="collection">
          {docs
            .map(doc =>
              <li key={doc.title} className="collection-item">
                <div className="row doc-collection-item">
                  <div className="col s4 offset s2 title"><a href="#">
                    {doc.title}</a></div>
                  <div className="user-buttons row col s3">
                    <a
                      className="waves-effect waves-light btn blue-grey"
                      id="editButton"
                      onClick={() => this.props.showModal(doc)}>
                      <i className="tiny material-icons left">edit</i>edit</a>
                    <a
                      className="waves-effect waves-light btn blue-grey"
                      onClick={() => this.deleteDocument(doc.id)}>
                      <i className="tiny material-icons left">delete</i>delete</a>
                  </div>
                </div>
              </li>
            )}
        </ul>
        <div className="fixed-action-btn horizontal">
          <a className="btn-floating btn-large tooltipped blue-grey"
            data-position="top" data-delay="50"
            data-tooltip="create new document"
            onClick={() => this.props.showModal()}
          >
            <i className="material-icons">note_add</i>
          </a>
        </div>
      </div>
    );
  }
}

DocumentList.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  docs: React.PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
};

/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps({
  auth: { user }
}) {
  return {
    user
  };
}

export default connect(mapStateToProps, { deleteDocument })(DocumentList);
