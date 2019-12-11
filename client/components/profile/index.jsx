import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import FaceIcon from '@material-ui/icons/Face';
import EmailIcon from '@material-ui/icons/Email';
import { getUserInfo, updateUserInfo } from '../../actions';
import TextFieldGroup from '../Common/TextFieldGroup';
import './profile.scss';

const Profile = ({ getUserDetails, userDetails, updateUserDetails }) => {
    const [user, setUser] = useState({});
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getUserDetails(userDetails.id).then(() => {
            setUser(userDetails);
        });
    }, [JSON.stringify(userDetails)]);

    const handleInputChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        await updateUserDetails(user.id, user);
        setSubmitting(false);
    };

    return (
        <div className="profile-root">
            <form className="profile-form" onSubmit={handleSubmit}>
                <TextFieldGroup
                    icon={<FaceIcon />}
                    error={errors.username}
                    onChange={handleInputChange}
                    value={user.username}
                    field="username"
                    name="username"
                    type="text"
                    inputClass="profile-form-input-box"
                    placeholder="Username"
                />

                <TextFieldGroup
                    icon={<PermIdentityIcon />}
                    error={errors.firstname}
                    onChange={handleInputChange}
                    value={user.firstname}
                    field="firstname"
                    name="firstname"
                    type="text"
                    inputClass="profile-form-input-box"
                    placeholder="First Name"
                />

                <TextFieldGroup
                    icon={<AccountCircleIcon />}
                    error={errors.lastname}
                    onChange={handleInputChange}
                    value={user.lastname}
                    field="lastname"
                    name="lastname"
                    type="text"
                    inputClass="profile-form-input-box"
                    placeholder="Last Name"
                />

                <TextFieldGroup
                    icon={<EmailIcon />}
                    error={errors.email}
                    onChange={handleInputChange}
                    value={user.email}
                    field="email"
                    type="email"
                    inputClass="profile-form-input-box"
                    placeholder="Email"
                />

                <button
                    disabled={submitting}
                    className="btn btn-default profile-btn"
                    type="submit"
                    // onClick={handleSubmit}
                >
                    UPDATE
                </button>
            </form>
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
