import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email is invalid.';
    if (!formData.password) errors.password = 'Password is required.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        dispatch(signInStart());
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(signInSuccess(data));
          navigate('/');
        } else {
          const errorData = await response.json();
          dispatch(signInFailure(errorData.error));
        }
      } catch (error) {
        dispatch(signInFailure(error.message));
      }
    }
  };

  return (
    <form className="max-w-md mx-auto bg-white p-8 mt-10 rounded shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>

      {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

      {['email', 'password'].map((field) => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block text-gray-700 capitalize">{field}</label>
          <input
            type={field === 'email' ? 'email' : 'password'}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors[field] && <div className="text-red-500 text-sm mt-1">{errors[field]}</div>}
        </div>
      ))}

      <button
        type="submit"
        className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignInForm;
