import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  loadUserDocuments,
  loadAllDocuments
} from '../../actions/documentActions';
import './index.scss';
import TabsPanel from './tabs-panel';

class DashboardPage extends React.Component {
  state = {
    isPrivate: false
  };

  componentDidMount() {
    this.props.loadAllDocuments().then(() => {
      console.log('yeyenatu', this.props.user.documents);
    });
  }

  render() {
    const {
      props: { publicDocuments, roleDocuments, privateDocuments }
    } = this;

    return (
      <div className="dashboard-root">
        <TabsPanel
          privateDocuments={privateDocuments}
          publicDocuments={publicDocuments}
          roleDocuments={roleDocuments}
        />
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
  loadAllDocuments: PropTypes.func.isRequired
};

const filterDocument = (role, documents) =>
  documents.filter(doc => doc.access === role);

const mapStateToProps = state => {
  const {
    admin: { documents },
    user,
    auth
  } = state;
  const publicDocuments = filterDocument('public', documents);
  const roleDocuments = filterDocument('role', documents);
  const privateDocuments = filterDocument('private', documents);

  return {
    auth,
    user,
    publicDocuments,
    roleDocuments,
    privateDocuments
  };
};

export default connect(mapStateToProps, {
  loadUserDocuments,
  loadAllDocuments
})(DashboardPage);
