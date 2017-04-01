
import React, { PropTypes } from 'react';

const TextFieldGroup = ({ field, value, label, error, type, onChange,
  checkUserExists, clearError, placeholder, icon }) => {
  let errorClass = 'input-field col s12';
  if (error && error.length > 0) {
    errorClass += 'red-text';
  }
  return (
    <div className={errorClass}>
      <i className="material-icons prefix">{icon}</i>
      <input
        value={value}
        onChange={onChange}
        onBlur={checkUserExists}
        type={type}
        name={field}
        placeholder={placeholder}
        icon={icon}
        className="validate"
        onFocus={clearError}
      />
      {error && <span className="red-text">
        <i className="material-icons">error_outline</i>{error}</span>}
      <label htmlFor={field} classnames="active">{label}</label>
    </div>
  );
};

TextFieldGroup.propTypes = {
  field: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: React.PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: React.PropTypes.func,
  clearError: React.PropTypes.func,
  placeholder: React.PropTypes.string,
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;
