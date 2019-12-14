import { LOAD_ALL_DOCUMENTS, RESET } from '../actions';
import initialState from './initialState';

export default (state = initialState.documents, action) => {
    switch (action.type) {
        case LOAD_ALL_DOCUMENTS:
            return action.payload.documents;

        case RESET:
            return initialState.documents;

        default:
            return state;
    }
};
