import shortid from 'shortid';
import findIndex from 'lodash/findIndex';
import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from '../actions/actionTypes';

export default (state = [], action = {}) => {
  let returnValue;
  switch (action.type) {
    case ADD_FLASH_MESSAGE:
      returnValue = [
        ...state,
        {
          id: shortid.generate(),
          type: action.message.type,
          text: action.message.text
        }
      ];
      break;
    case DELETE_FLASH_MESSAGE: {
      const index = findIndex(state, { id: action.id });
      if (index >= 0) {
        returnValue = [
          ...state.slice(0, index),
          ...state.slice(index + 1)
        ];
      }
      returnValue = state;
    }
      break;
    default:
      returnValue = state;
  }
  return returnValue;
};
