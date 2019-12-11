import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const TextFieldGroup = ({
    field,
    value,
    error,
    type,
    onChange,
    onBlur,
    clearError,
    placeholder,
    icon,
    inputClass,
    disabled
}) => {
    if (error && error.length > 0) {
        errorClass += 'red-text';
    }

    return (
        <div className="textfield-root">
            <div className="textfield-icon">{icon}</div>
            <input
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                type={type}
                name={field}
                placeholder={placeholder}
                icon={icon}
                onFocus={clearError}
                className={inputClass}
                disabled={disabled}
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
    icon: PropTypes.node,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    clearError: PropTypes.func,
    placeholder: PropTypes.string,
    inputClass: PropTypes.string,
    disabled: PropTypes.bool
};

TextFieldGroup.defaultProps = {
    type: 'text',
    value: ''
};

export default TextFieldGroup;
