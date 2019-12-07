import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import toastr from 'toastr';
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import { connect } from 'react-redux';
import './index.scss';

class DocumentForm extends React.Component {
  state = {
    errors: {},
    doc: this.props.doc || {},
    editable: true
  };

  // componentWillReceiveProps(nextProps) {
  //   const editable =
  //     nextProps.doc.ownerId === this.props.auth.user.id || !nextProps.doc.id;
  //   if (!editable) {
  //     $('.fr-wrapper').froalaEditor('edit.off');
  //   }
  //   this.setState({
  //     doc: nextProps.doc,
  //     editable: editable
  //   });
  // }

  handleInputChange = event => {
    const { name: field, value } = event.target;
    const ownerId = this.props.auth.user.id;
    const role = String(this.props.auth.user.roleId);
    this.setState(state => {
      const doc = Object.assign({}, state.doc, {
        [field]: value,
        ownerId,
        role
      });
      return { doc };
    });
  };

  handleModelChange = model => {
    this.setState(state => {
      const doc = Object.assign({}, state.doc, { content: model });
      return { doc };
    });
  };

  saveDocument = event => {
    event.preventDefault();
    this.props.actions
      .saveDocument(this.state.doc, this.props.auth.user.id)
      .then(() => {
        toastr.success('Document Successfully Saved');
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Cannot save Document'
        });
        toastr.error('Cannot save Document');
      });
  };

  updateDocument = event => {
    event.preventDefault();
    this.props.actions
      .updateDocument(this.state.doc, this.props.auth.user.id)
      .then(() => {
        toastr.success('Document Successfully Updated');
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Unable to update document'
        });
        toastr.error('Unable to update document');
      });
  };

  redirect() {
    toastr.success('Document Successfully Saved');
    this.props.history.push('/documents');
  }

  render() {
    const {
      state: {
        editable,
        doc: { id, title = '', content = '', access }
      },
      handleInputChange,
      handleModelChange,
      updateDocument,
      saveDocument
    } = this;

    return (
      <div>
        <form className="document-form">
          <div className="row">
            {!editable && 'View Only'}
            <div>
              <input
                icon="subject"
                id="title"
                type="text"
                value={title}
                name="title"
                placeholder="Enter a Title here!"
                className="validate"
                onChange={handleInputChange}
              />
              <label id="labeltitle" htmlFor="title" className="active">
                Title
              </label>
            </div>

            <div className="input-field col s12">
              <FroalaEditor
                tag="textarea"
                model={content}
                onModelChange={handleModelChange}
              />
            </div>

            <br />

            <div className="input-field col s12">
              <select
                name="access"
                id="accessDropdown"
                value={access}
                className="browser-default"
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Document Visibility Access
                </option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="role">Role</option>
              </select>
            </div>

            <div>
              <input
                icon="save"
                id="saveButton"
                type="submit"
                value="Save"
                className="btn waves-effect waves-light blue-grey"
                onClick={id ? updateDocument : saveDocument}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

DocumentForm.propTypes = {
  auth: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  doc: PropTypes.object.isRequired,
  history: PropTypes.object
};

const ConnectedDocumentForm = connect(null, null)(DocumentForm);

export default withRouter(ConnectedDocumentForm);
