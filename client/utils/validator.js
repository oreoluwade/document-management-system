import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export const signupValidator = data => {
    const errors = {};

    if (Validator.isEmpty(data.username)) {
        errors.userName = 'Username is required';
    }
    if (Validator.isEmpty(data.firstname)) {
        errors.firstName = 'First Name is required';
    }
    if (Validator.isEmpty(data.lastname)) {
        errors.lastName = 'Last Name is required';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }
    if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password must be at least 6 characters';
    }
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Passwords must match';
    }
    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export const loginValidator = data => {
    const errors = {};

    if (Validator.isEmpty(data.identifier)) {
        errors.identifier = 'This field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'This field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
