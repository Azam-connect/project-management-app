import React from 'react';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  rows = 2,
  ...rest
}) => {
  return (
    <div className={`mb-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        {...rest}
      />
    </div>
  );
};

export default Textarea;
