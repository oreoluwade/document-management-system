import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './index.scss';
import TabsPanel from './tabs-panel';

class Dashboard extends React.Component {
    state = {
        isPrivate: false
    };

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

Dashboard.propTypes = {
    auth: PropTypes.object,
    privateDocuments: PropTypes.array.isRequired,
    roleDocuments: PropTypes.array.isRequired,
    publicDocuments: PropTypes.array.isRequired
};

const filterDocument = (role, documents) => {
    return documents.filter(doc => doc.access === role);
};

const mapStateToProps = state => {
    const {
        user: { documents },
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
};

export default connect(mapStateToProps, null)(Dashboard);
