import React, { PropTypes } from 'react';

const UserList = ({ users, editUser, deleteUser }) =>
  (
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
                  <a className="waves-effect waves-light btn blue-grey"
                    onClick={() => editUser(user)}
                  >
                    <i className="tiny material-icons left">edit</i>edit</a>
                  <a className="waves-effect waves-light btn blue-grey"
                    onClick={() => deleteUser(user.id)}
                  >
                    <i className="tiny material-icons left">delete</i>delete</a>
                </div>
              </div>
            </li>
          )}
      </ul>
    </div>
  );

UserList.propTypes = {
  editUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  users: React.PropTypes.array.isRequired
};

export default UserList;
