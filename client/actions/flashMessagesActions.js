import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from './actionTypes';


/**
 * Add flash messages action
 * @export
 * @param {any} message
 * @returns {object}
 */
export function addFlashMessage(message) {
  return {
    type: ADD_FLASH_MESSAGE,
    message
  };
}


/**
 * Delete flash message action
 * @export
 * @param {any} id
 * @returns {object}
 */
export function deleteFlashMessage(id) {
  return {
    type: DELETE_FLASH_MESSAGE,
    id
  };
}
