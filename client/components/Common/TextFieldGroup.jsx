import React from 'react';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
    field,
    value,
    label,
    error,
    type,
    onChange,
    checkUserExists,
    clearError,
    placeholder,
    icon
}) => {
    let errorClass = 'input-field col s12';
    if (error && error.length > 0) {
        errorClass += 'red-text';
    }

    return (
        <div className="input-field">
            <div className="input-field-icon">{icon}</div>
            <input
                value={value}
                onChange={onChange}
                onBlur={checkUserExists}
                type={type}
                name={field}
                placeholder={placeholder}
                icon={icon}
                onFocus={clearError}
            />
            {/* {error && <span className="red-text">
        <i className="material-icons">error_outline</i>{error}</span>}
      <label htmlFor={field} classnames="active">{label}</label> */}
        </div>
    );
};

TextFieldGroup.propTypes = {
    field: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.node,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    checkUserExists: PropTypes.func,
    clearError: PropTypes.func,
    placeholder: PropTypes.string
};

TextFieldGroup.defaultProps = {
    type: 'text',
    value: ''
};

export default TextFieldGroup;
