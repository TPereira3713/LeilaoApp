import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AccountSettings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setError('Please fill out both fields.');
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      setSuccess('Password changed successfully');
      setError('');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="mb-4">
        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handlePasswordChange}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Change Password
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
    </div>
  );
};

export default AccountSettings;

