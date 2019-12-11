import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserInfo, updateUserInfo } from '../../actions';

const Profile = ({ getUserDetails, userDetails }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        getUserDetails(userDetails.id).then(() => {
            console.log('USER AFTER FETCHING', userDetails);
            setUser(userDetails);
        });
    }, [JSON.stringify(userDetails)]);

    return (
        <div>
            <h1>This is the profile page</h1>
            <p>{user.username}</p>
        </div>
    );

    // handleInputChange = event => {
    //     const { name: field, value } = event.target;
    //     return this.setState(state => {
    //         const user = Object.assign({}, state.user, { [field]: value });
    //         return { user };
    //     });
    // };

    // handleDataSubmit = () => {
    //     const userInfo = this.state.user;
    //     return this.props.updateUserInfo(userInfo);
    // };
};

Profile.propTypes = {
    userDetails: PropTypes.object,
    updateUserDetails: PropTypes.func,
    getUserDetails: PropTypes.func
};

const mapStateToProps = state => ({
    userDetails: state.user.details
});

export default connect(mapStateToProps, {
    getUserDetails: getUserInfo,
    updateUserDetails: updateUserInfo
})(Profile);
