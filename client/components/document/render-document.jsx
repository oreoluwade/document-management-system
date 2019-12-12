import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
// import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import TitleIcon from '@material-ui/icons/Title';
import { connect } from 'react-redux';
import './index.scss';
import TextFieldGroup from '../base/text-field-group';
import { saveDocument, updateDocument } from '../../actions';

class RenderDocument extends React.Component {
    state = {
        errors: {},
        document: this.props.document || {},
        editable: true,
        documentId: ''
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            const {
                match: {
                    params: { id: documentId }
                },
                user
            } = this.props;
            this.setState({
                documentId,
                editable:
                    this.props.document &&
                    this.props.document.ownerId === user.id
            });
        }
    }

    handleInputChange = event => {
        const { id: ownerId, roleId } = this.props.user;
        const { name: field, value } = event.target;
        const role = String(roleId);
        this.setState(state => {
            const document = {
                ...state.document,
                [field]: value,
                ownerId,
                role
            };
            return { document };
        });
    };

    handleModelChange = model => {
        this.setState(state => {
            const document = { ...state.document, content: model };
            return { document };
        });
    };

    createDocument = async e => {
        e.preventDefault();
        try {
            await this.props.saveDocument(
                this.state.document,
                this.props.user.id
            );
            Swal.fire({
                icon: 'success',
                title: 'Document created',
                showConfirmButton: false,
                timer: 1500
            });
            this.props.history.push('/dashboard');
        } catch (error) {
            console.log('Error', error);
        }
    };

    editDocument = async e => {
        e.preventDefault();
        try {
            await this.props.updateDocument(
                this.state.document,
                this.props.user.id
            );
            Swal.fire({
                icon: 'success',
                title: 'Document created',
                showConfirmButton: false,
                timer: 1500
            });
            this.props.history.push('/dashboard');
        } catch (error) {
            console.log('Update Error', error);
        }
    };

    render() {
        const {
            state: {
                document: { title = '', content = '', access },
                documentId,
                editable
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
                        disabled={!editable}
                    />

                    <FroalaEditor
                        tag="textarea"
                        model={content}
                        onModelChange={handleModelChange}
                        contenteditable={!editable}
                    />

                    <div className="document-form__select__wrapper">
                        <select
                            name="access"
                            id="accessDropdown"
                            value={access}
                            className="document-form__select"
                            onChange={handleInputChange}
                            disabled={!editable}
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
                        onClick={documentId ? editDocument : createDocument}
                    >
                        {documentId ? 'UPDATE' : 'SAVE DOCUMENT'}
                    </button>
                </form>
            </div>
        );
    }
}

RenderDocument.propTypes = {
    auth: PropTypes.object,
    onChange: PropTypes.func,
    document: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    user: PropTypes.object,
    saveDocument: PropTypes.func,
    updateDocument: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user.details,
        document: state.user.documents.find(
            item => item.id === Number(ownProps.match.params.id)
        )
    };
};

export default withRouter(
    connect(mapStateToProps, { saveDocument, updateDocument })(RenderDocument)
);
