import React from 'react';
import Select from 'react-select';

const SelectDropdown = ({
  label,
  name,
  value,
  onChange,
  options = [],
  isLoading = false,
  isSearchable = true,
  isClearable = true,
  handleInputChange,
  isMulti = false,
  className = '',
}) => {
  const handleChange = (selectedOption) => {
    onChange({
      target: {
        name,
        value: selectedOption,
      },
    });
  };
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Select
        name={name}
        value={value}
        onChange={handleChange}
        options={options}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        classNamePrefix="select"
        onInputChange={handleInputChange}
        menuPortalTarget={document.body}
        className={`p-2 px-0`}
        isMulti={isMulti}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default SelectDropdown;
