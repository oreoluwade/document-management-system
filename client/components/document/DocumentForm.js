import React, { PropTypes } from 'react';
import toastr from 'toastr';
import classnames from 'classnames';
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as documentActions from '../../actions/documentActions';
import { addFlashMessage } from '../../actions/flashMessages';


class DocumentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      document: {},
      errors: {},
      documentTitle: Object.assign({}, props.docValue).title,
      model: Object.assign({}, props.docValue).content,
      select: Object.assign({}, props.docValue).access,
      ownerId: Object.assign({}, props.docValue).ownerId,
      displaySaveButton: true
    };
    this.onChange = this.onChange.bind(this);
    this.updateSelectState = this.updateSelectState.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
  }

  componentDidMount() {
    $('#accessDropdown').on('change', this.updateSelectState);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.docValue.id !== nextProps.docValue.id) {
      // Necessary to populate form when existing documents loaded directly.
      this.setState({
        documentTitle: Object.assign({}, nextProps.docValue).title,
        model: Object.assign({}, nextProps.docValue).content,
        select: Object.assign({}, nextProps.docValue).access,
        ownerId: Object.assign({}, nextProps.docValue).ownerId,
      });
    }
    this.setState({ displaySaveButton: true });
    if (nextProps.docValue.ownerId !== this.props.auth.user.userId) {
      $('.fr-wrapper').froalaEditor('edit.off');
      this.setState({ displaySaveButton: false });
    }
    if (nextProps.docValue.id === '') {
      this.setState({ displaySaveButton: true });
    }
  }

  onChange(event) {
    const field = event.target.name;
    const document = this.state.document;
    document[field] = event.target.value;
    document.ownerId = this.props.auth.user.userId;
    document.role = String(this.props.auth.user.userRoleId);
    this.setState({ document, documentTitle: event.target.value });
  }

  updateSelectState(event) {
    this.setState({ select: event.target.value });
  }

  handleModelChange(model) {
    const document = this.state.document;
    document.content = model;
    this.setState({ document, model });
  }

  saveDocument(event) {
    event.preventDefault();
    this.props.actions.saveDocument(this.state.document)
      .then(() => {
        toastr.success('Document Successfully Saved');
        $('#docDisplayModal').modal('close');
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Unable to save document'
        });
        toastr.error('Unable to save document');
        $('#docDisplayModal').modal('close');
      });
  }

  updateDocument(event) {
    event.preventDefault();
    this.props.actions.updateDocument(this.state.document)
      .then(() => {
        toastr.success('Document Successfully Saved');
        $('#docDisplayModal').modal('close');
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Unable to update document'
        });
        toastr.error('Unable to update document');
        $('#docDisplayModal').modal('close');
      });
  }

  redirect() {
    toastr.success('Document Successfully Saved');
    this.context.router.push('/document');
    $('#docDisplayModal').modal('close');
  }

  render() {
    const isValue = this.props.currentDocument;
    const { displaySaveButton } = this.state;
    const form = (
      <form>
        <div className="row">
          {displaySaveButton ? '' : 'View Only'}
          <div className="input-field col s12">
            <input
              icon="subject"
              id="title"
              type="text"
              value={this.state.documentTitle}
              name="title"
              placeholder="Enter a Title here!"
              className="validate"
              onChange={this.onChange} />
            <label id="labeltitle"
              htmlFor="title" className="active">Title
            </label>
          </div>

          <div className="input-field col s12">
            <FroalaEditor
              tag="textarea"
              model={this.state.model}
              onModelChange={this.handleModelChange} />
          </div>

          <br />

          <div className="input-field col s12">
            <select name="access" id="accessDropdown"
              value={this.state.select}
              className="browser-default" onChange={this.updateSelectState}>
              <option value="" disabled >Document Visibility Access</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="role">Role</option>
            </select>
          </div>

          <div className={classnames('input-field col s12', {
            hide: displaySaveButton === false
          })}>
            <input
              icon="save"
              id="saveButton"
              type="submit"
              value="Save"
              className="btn waves-effect waves-light blue-grey"
              onClick={isValue ? this.updateDocument : this.saveDocument} />

          </div>
        </div>
      </form>
    );
    return (
      <div>
        {form}
      </div>
    );
  }
}

DocumentForm.propTypes = {
  auth: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  docValue: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  documents: PropTypes.array.isRequired,
  currentDocument: PropTypes.string,
  addFlashMessage: PropTypes.func.isRequired
};

/**
 * @param {any} documents
 * @param {any} id
 * @returns {any} object
 */
function getDocumentById(documents, id) {
  const document = documents.filter(doc => String(doc.id) === id);
  if (document) {
    return document[0]; // The filter method returns an array
  }
  return null;
}


/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps(state) {
  const docsInState = state.handleDocuments;
  const id = docsInState.chosenDocument;
  let document = {
    id: '',
    title: '',
    content: '',
    access: '',
    ownerId: ''
  };
  if (id > 0) {
    document = getDocumentById(docsInState.documents, id);
  }
  return {
    documents: docsInState.documents,
    currentDocument: docsInState.chosenDocument,
    docValue: document,
    auth: state.auth
  };
}

/**
 * @param {any} dispatch
 * @returns {any}
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(documentActions, dispatch),
    addFlashMessage: bindActionCreators(addFlashMessage, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentForm);
