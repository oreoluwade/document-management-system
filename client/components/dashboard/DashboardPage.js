import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadUserDocuments, loadAllDocuments } from '../../actions/documentActions';
import PublicDocsCollection from '../document/PublicDocsCollection';
import RoleDocsCollection from '../document/RoleDocsCollection';
import PrivateDocsCollection from '../document/PrivateDocsCollection';
import CommonModal from '../common/CommonModal';


class DashboardPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPrivate: false
    };
  }

  componentWillMount() {
    const { userRoleId } = this.props.auth.user;
    if (userRoleId === 1) {
      this.props.loadAllDocuments();
      this.setState({ isPrivate: true });
    } else {
      this.props.loadUserDocuments(userRoleId);
    }
  }

  componentDidMount() {
    $('.modal').modal();
    $('select').material_select();
    $('.tooltipped').tooltip({ delay: 50 });
    $('.dropdown-button').dropdown();
    $('ul.tabs').tabs();
    $('ul.tabs').tabs('select_tab', 'public');
  }

  render() {
    const { publicDocuments, roleDocuments, privateDocuments } = this.props;
    return (
      <div className="row">
        <div className="col s12">
          <div id="dashboard" className="col s12 z-depth-5 card-panel">
            <h5 className="center">DASHBOARD</h5>
            <div className="container">
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
                  <CommonModal />
                  <div id="private" className="col s12 tab-style">
                    {this.state.isPrivate ?
                      <h6>All Private Documents</h6> : ''}
                    <PrivateDocsCollection privateDocuments={privateDocuments}/>
                  </div>
                  <div id="public" className="col s12 tab-style">
                    <h6>All Public Documents</h6>
                    <PublicDocsCollection publicDocuments={publicDocuments}/>
                  </div>
                  <div id="role" className="col s12 tab-style">
                    <h6>All Accessible Role Documents</h6>
                    <RoleDocsCollection roleDocuments={roleDocuments}/>
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

function mapStateToProps(state) {
  const docsInState = state.handleDocuments;
  let roleDocuments = [];
  let privateDocuments = [];
  const publicDocuments = docsInState.documents.filter(
    doc => doc.access === 'public');
  if (state.auth.isAuthenticated && state.auth.user.userRoleId !== 1) {
    roleDocuments = docsInState.documents.filter(
      doc => doc.role === String(state.auth.user.userRoleId));
  } else if (state.auth.isAuthenticated && state.auth.user.userRoleId === 1) {
    roleDocuments = docsInState.documents.filter(
      doc => doc.access === 'role');
    privateDocuments = docsInState.documents.filter(
      doc => doc.access === 'private');
  }

  return {
    auth: state.auth,
    publicDocuments,
    roleDocuments,
    privateDocuments
  };
}


export default connect(mapStateToProps, { loadUserDocuments, loadAllDocuments })(DashboardPage);

