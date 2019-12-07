import initialState from './initialState';

export default (state = initialState.admin, action) => {
  // switch (action.type) {
  //   case types.LOAD_ROLE_SUCCESS:
  //     return Object.assign({}, ...state, { roles: action.roles });

  //   default:
  //     return state;
  // }
  return state;
};
