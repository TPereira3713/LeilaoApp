import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    homeAddress: '',
    postalCode: '',
    cellphone: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const errors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email is invalid.';
    if (!formData.password) errors.password = 'Password is required.';
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) errors.password = 'Password must be at least 8 characters long and contain at least one letter and one number.';
    if (!formData.name) errors.name = 'Name is required.';
    if (!formData.homeAddress) errors.homeAddress = 'Home address is required.';
    if (!/^\d{5}$/.test(formData.postalCode)) errors.postalCode = 'Postal code is invalid.';
    if (!/^\+?[0-9]{10,15}$/.test(formData.cellphone)) errors.cellphone = 'Cellphone number is invalid.';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          setMessage('User created successfully!');
          navigate('/login');
        } else {
          const errorData = await response.json();
          setMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <form className="max-w-md mx-auto bg-white p-8 mt-10 rounded shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

      {message && <div className="mb-4 text-green-500">{message}</div>}

      {['email', 'password', 'name', 'homeAddress', 'postalCode', 'cellphone'].map((field) => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block text-gray-700 capitalize">
            {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </label>
          <input
            type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors[field] && <div className="text-red-500 text-sm mt-1">{errors[field]}</div>}
        </div>
      ))}

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
