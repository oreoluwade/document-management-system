import { SET_CURRENT_USER } from '../actions';
import initialState from './initialState';

export default (
    state = {
        isAuthenticated: initialState.isAuthenticated,
        user: initialState.user
    },
    action = {}
) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: Object.values(action.payload.user).every(
                    item => !!item
                ),
                user: action.payload.user
            };

        default:
            return state;
    }
};
