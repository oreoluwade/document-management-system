import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentList from './documents-list';
import * as documentActions from '../../actions/documentActions';

class DocumentPage extends React.Component {
  state = {
    doc: {}
  };

  componentDidMount() {
    const { id } = this.props.user;
    this.props.actions.loadUserDocuments(id);
  }

  addNewDocument = (doc = {}) => {
    this.setState({ doc }, () => {
      console.log('after state setting');
    });
  };

  render() {
    const {
      props: { personalDocuments },
      state: { doc }
    } = this;
    const count = personalDocuments.length;

    return (
      <div className="document-page row">
        <div className="col s12 z-depth-5 card-panel">
          <div className="row">
            <div className="col s12">
              <div className="row">
                <div className="col s5">
                  <div id="card-alert" className="card grey-blue lighten-5">
                    <div className="card-content black-text" id="documentCount">
                      <p>{`You have ${count} saved Document${
                        count === 1 ? '' : 's'
                      }`}</p>
                    </div>
                  </div>
                </div>
                <div className="col s12">
                  <DocumentList
                    showModal={this.addNewDocument}
                    docs={personalDocuments}
                  />
                </div>
              </div>
            </div>
          </div>
          <CustomModal doc={doc} />
        </div>
      </div>
    );
  }
}

DocumentPage.propTypes = {
  personalDocuments: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps({
  handleDocuments: { documents, chosenDocument },
  auth: { user, isAuthenticated }
}) {
  let personalDocuments = [];
  if (isAuthenticated) {
    personalDocuments = documents.filter(doc => doc.ownerId === user.id);
  }

  const publicDocuments = documents.filter(doc => doc.access === 'public');

  return {
    personalDocuments,
    publicDocuments,
    currentDocument: chosenDocument,
    user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(documentActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage);
