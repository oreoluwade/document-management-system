import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import toastr from 'toastr';
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import TitleIcon from '@material-ui/icons/Title';
import { connect } from 'react-redux';
import './index.scss';
import TextFieldGroup from '../Common/TextFieldGroup';

class RenderDocument extends React.Component {
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
    console.log(model);
    this.setState(state => {
      const doc = Object.assign({}, state.doc, { content: model });
      return { doc };
    });
  };

  createDocument = event => {
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
      createDocument
    } = this;

    return (
      <div className="document-root">
        <form className="document-form">
          <TextFieldGroup
            icon={<TitleIcon />}
            field="identifier"
            label="Title"
            value={title}
            onChange={handleInputChange}
            type="text"
            placeholder="Document Title"
            inputClass="document-form-input"
          />

          <FroalaEditor
            tag="textarea"
            model={content}
            onModelChange={handleModelChange}
          />

          <div className="document-form__select__wrapper">
            <select
              name="access"
              id="accessDropdown"
              value={access}
              className="document-form__select"
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Document Visibility Access
              </option>
              <option value="public">PUBLIC</option>
              <option value="private">PRIVATE</option>
              <option value="role">FOR USERS WITH MY ROLE</option>
            </select>
          </div>

          <button
            type="button"
            className="btn-default document-form__button"
            onClick={id ? updateDocument : createDocument}
          >
            SAVE DOCUMENT
          </button>
        </form>
      </div>
    );
  }
}

RenderDocument.propTypes = {
  auth: PropTypes.object,
  onChange: PropTypes.func,
  doc: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(connect(null, null)(RenderDocument));
