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
import { saveDocument, updateDocument } from '../../actions';

class RenderDocument extends React.Component {
  state = {
    errors: {},
    doc: this.props.doc || {},
    editable: true,
    documentId: ''
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
    const { id: ownerId, roleId } = this.props.user;
    const { name: field, value } = event.target;
    const role = String(roleId);
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
    this.props
      .saveDocument(this.state.doc, this.props.user.id)
      .then(() => {
        toastr.success('Document Successfully Saved');
      })
      .catch(() => {
        toastr.error('Cannot save Document');
      });
  };

  editDocument = event => {
    event.preventDefault();
    this.props
      .updateDocument(this.state.doc, this.props.user.id)
      .then(() => {
        toastr.success('Document Successfully Updated');
      })
      .catch(() => {
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
        doc: { documentId, title = '', content = '', access }
      },
      handleInputChange,
      handleModelChange,
      editDocument,
      createDocument
    } = this;

    return (
      <div className="document-root">
        <form className="document-form">
          <TextFieldGroup
            icon={<TitleIcon />}
            field="title"
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
            onClick={Boolean(documentId) ? editDocument : createDocument}
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

const mapStateToProps = state => {
  return { user: state.user.details };
};

export default withRouter(
  connect(mapStateToProps, { saveDocument, updateDocument })(RenderDocument)
);
