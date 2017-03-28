import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
  const errors = {};

  if (Validator.isEmpty(data.userName)) {
    errors.userName = 'The field is required';
  }
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'This field is required';
  }
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'This field is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'email is invalid';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'email is invalid';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }
  if (Validator.isEmpty(data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Passwords must match';
  }
  if (!Validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
