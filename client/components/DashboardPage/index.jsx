import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  loadUserDocuments,
  loadAllDocuments
} from '../../actions/documentActions';
import DocumentList from '../DocumentPage/DocumentList';
import { CustomModal } from '../Common';


class DashboardPage extends React.Component {
  state = {
    isPrivate: false,
    displayedDocument: {}
  };

  componentDidMount() {
    this.props.loadAllDocuments();
    $('.modal').modal();
    $('select').material_select();
    $('.tooltipped').tooltip({ delay: 50 });
    $('.dropdown-button').dropdown();
    $('ul.tabs').tabs();
    $('ul.tabs').tabs('select_tab', 'public');
  }

  renderModal = (displayedDocument = {}) => {
    this.setState({ displayedDocument }, () => {
      $('#docDisplayModal').modal('open');
    });
  }

  render() {
    const {
      props: { publicDocuments, roleDocuments, privateDocuments },
      state: { displayedDocument },
      renderModal,
    } = this;

    return (
      <div className="dashboard row">
        <div className="col s12">
          <div className="col s12 z-depth-5 card-panel">
            <h5 className="center">DASHBOARD</h5>
            <div>
              <div className="row">
                <div className="col s12">
                  <ul
                    className="tabs tab-demo-active z-depth-1 blue-grey">
                    <li className="tab col s4">
                      <a className="white-text waves-effect waves-light active"
                        href="#public">Public</a>
                    </li>
                    <li className="tab col s4">
                      <a className="white-text waves-effect waves-light"
                        href="#role">Role</a>
                    </li>
                    <li className="tab col s4">
                      <a className="white-text waves-effect waves-light"
                        href="#private">Private</a>
                    </li>
                  </ul>
                </div>
                <div className="col s12">
                  <CustomModal doc={displayedDocument}/>
                  <div id="private" className="col s12 tab-style">
                    <h6 className="center">Private Documents</h6>
                    <DocumentList showModal={renderModal} docs={privateDocuments} />
                  </div>
                  <div id="public" className="col s12 tab-style">
                    <h6 className="center">Public Documents</h6>
                    <DocumentList showModal={renderModal} docs={publicDocuments} />
                  </div>
                  <div id="role" className="col s12 tab-style">
                    <h6 className="center">Documents Accessible to your Role</h6>
                    <DocumentList showModal={renderModal} docs={roleDocuments} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  auth: PropTypes.object,
  privateDocuments: PropTypes.array.isRequired,
  roleDocuments: PropTypes.array.isRequired,
  publicDocuments: PropTypes.array.isRequired,
  loadUserDocuments: PropTypes.func.isRequired,
  loadAllDocuments: PropTypes.func.isRequired,
};

const filterDocument = (role, documents) => documents.filter(doc => doc.access === role);

function mapStateToProps(state) {
  const {
    handleDocuments: { documents },
    auth
  } = state;
  const publicDocuments = filterDocument('public', documents);
  const roleDocuments = filterDocument('role', documents);
  const privateDocuments = filterDocument('private', documents);

  return {
    auth,
    publicDocuments,
    roleDocuments,
    privateDocuments
  };
}

export default connect(mapStateToProps, {
  loadUserDocuments,
  loadAllDocuments
})(DashboardPage);

