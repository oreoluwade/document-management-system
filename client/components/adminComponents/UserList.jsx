import React from 'react';
import PropTypes from 'prop-types';
import { addDisabledClass, disabledUsers } from './disabledItems';

const UserList = ({ users, editUser, deleteUser }) => {
  const handleEditUser = (userToBeEdited) => {
    if (userToBeEdited.Role.title === 'admin') return;
    editUser(userToBeEdited);
  };

  const handleDeleteUser = (userToBeDeleted) => {
    if (userToBeDeleted.Role.title === 'admin') return;
    deleteUser(userToBeDeleted.id);
  };

  return (
    <div className="user-collection">
      <ul className="collection">
        {users
          .map(user =>
            <li key={user.email} className="collection-item">
              <div className="row user-collection-item">
                <div className="col s4 offset s2 email">{user.email}</div>
                <div className="col s2 name">{user.userName}</div>
                <div className="col s1 role">{user.Role.title}</div>
                <div className="user-buttons row col s3">
                  <a
                    className={`waves-effect waves-light btn blue-grey ${addDisabledClass(user.Role.title, disabledUsers)}`}
                    onClick={handleEditUser(user)}>
                    <i className="tiny material-icons left">edit</i>edit
                  </a>
                  <a
                    className={`waves-effect waves-light btn blue-grey ${addDisabledClass(user.Role.title, disabledUsers)}`}
                    onClick={handleDeleteUser(user)}>
                    <i className="tiny material-icons left">delete</i>delete
                  </a>
                </div>
              </div>
            </li>
          )}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  editUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  users: PropTypes.array
};

export default UserList;
