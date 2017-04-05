/* eslint class-methods-use-this: "off"*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocCollection from './DocCollection';
import * as documentActions from '../../actions/documentActions';
import CommonModal from '../common/CommonModal';

class DocumentPage extends React.Component {
  constructor(props) {
    super(props);

    this.clickToDelete = this.clickToDelete.bind(this);
  }

  componentWillMount() {
    const { userId } = this.props.user;
    this.props.actions.loadUserDocuments(userId);
  }

  componentDidMount() {
    $('.modal').modal();
    $('select').material_select();
    $('.tooltipped').tooltip({ delay: 50 });
  }

  clickToDelete() {
    this.props.actions.deleteCurrentDocument();
    $('#docsDisplayModal').modal('open');
  }

  render() {
    const { personalDocuments } = this.props;
    const count = personalDocuments.length;

    return (
      <div className="document-page row">
        <div className="col s12 z-depth-5 card-panel">
          {/*<h4 className="center">MY DOCUMENTS</h4>*/}
          <div id="addBtnDiv"
            className="fixed-action-btn" onClick={this.clickToDelete}>
            <a
              className="btn-floating btn-large waves-effect waves-light red tooltipped"
              data-position="left" data-delay="50"
              data-tooltip="Delete current document">
              <i className="material-icons">delete</i>
            </a>
          </div>
          <div className="row">
            <div className="col s12">
              <div className="row">
                <div className="col s5">
                  <div id="card-alert" className="card grey-blue lighten-5">
                    <div className="card-content black-text" id="documentCount">
                      <p>{`You have ${count} saved Document${count === 1 ? '' : 's'}`}</p>
                    </div>
                  </div>
                </div>
                <div className="col s7">
                  <DocCollection documents={personalDocuments} />
                </div>
              </div>
            </div>

          </div>
          <CommonModal />
        </div>
      </div>
    );
  }
}

DocumentPage.propTypes = {
  personalDocuments: PropTypes.array.isRequired,
  publicDocuments: PropTypes.array,
  currentDocument: PropTypes.object,
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps({
  handleDocuments: { documents, chosenDocument },
  auth: { user, isAuthenticated }
}) {
  let personalDocuments = [];
  if (isAuthenticated) {
    personalDocuments = documents.filter(
      doc => doc.ownerId === user.userId);
  }

  const publicDocuments = documents.filter(
    doc => doc.access === 'public');

  return {
    personalDocuments,
    publicDocuments,
    currentDocument: chosenDocument,
    user
  };
}

/**
 * @param {any} dispatch
 * @returns {any}
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(documentActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage);
