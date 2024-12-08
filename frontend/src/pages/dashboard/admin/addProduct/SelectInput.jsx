import React from 'react';
//for admin
const SelectInput = ({ label, name, value, onChange, options }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-400">
        {label}
      </label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="add-product-InputCSS bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 pl-3 pr-10 py-2 rounded-md"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
