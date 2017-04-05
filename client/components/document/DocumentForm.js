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
      errors: {},
      chosenDocument: props.chosenDocument,
      displaySaveButton: true
    };
    this.onChange = this.onChange.bind(this);
    // this.updateSelectState = this.updateSelectState.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
  }

  componentDidMount() {
    $('#accessDropdown').on('change', this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    const editable = nextProps.chosenDocument.ownerId === this.props.auth.user.userId || !nextProps.chosenDocument.id;
    if (!editable) {
      $('.fr-wrapper').froalaEditor('edit.off');
    }
    if (this.props.chosenDocument.id !== nextProps.chosenDocument.id) {
      // Necessary to populate form when existing documents loaded directly.
      this.setState({
        chosenDocument: nextProps.chosenDocument,
        displaySaveButton: editable
      });
    }
  }

  onChange(event) {
    const { name: field, value } = event.target;
    const ownerId = this.props.auth.user.userId;
    const role = String(this.props.auth.user.userRoleId);
    this.setState((state) => {
      const chosenDocument = Object.assign({},
        state.chosenDocument, {
          [field]: value,
          ownerId,
          role
        });
      return { chosenDocument };
    });
  }

  handleModelChange(model) {
    this.setState((state) => {
      const chosenDocument = Object.assign({},
        state.chosenDocument, { content: model });
      return { chosenDocument };
    });
  }

  saveDocument(event) {
    event.preventDefault();
    this.props.actions.saveDocument(this.state.chosenDocument, this.props.auth.user.userId)
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
    this.props.actions.updateDocument(this.state.chosenDocument, this.props.auth.user.userId)
      .then(() => {
        toastr.success('Document Successfully Updated');
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
    this.context.router.push('/documents');
    $('#docDisplayModal').modal('close');
  }

  render() {
    const { displaySaveButton, chosenDocument } = this.state;
    const { id, title = '', content = '', access } = chosenDocument;
    const form = (
      <form>
        <div className="row">
          {!displaySaveButton && 'View Only'}
          <div className="input-field col s12">
            <input
              icon="subject"
              id="title"
              type="text"
              value={title}
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
              model={content}
              onModelChange={this.handleModelChange} />
          </div>

          <br />

          <div className="input-field col s12">
            <select name="access" id="accessDropdown"
              value={access}
              className="browser-default" onChange={this.onChange}>
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
              onClick={id ? this.updateDocument : this.saveDocument} />

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
  chosenDocument: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  addFlashMessage: PropTypes.func.isRequired
};

/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps(state) {
  const { chosenDocument = {} } = state.handleDocuments;

  return {
    chosenDocument,
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
