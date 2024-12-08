import React from 'react';
//for admin
const TextInput = ({ label, name, value, onChange, type = 'text', placeholder }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-400">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="add-product-InputCSS bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white pl-10 pr-4 py-3 rounded-md placeholder-white"
      />
    </div>
  );
};

export default TextInput;
