import React from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const UserInfo = () => {
  const { currentUser } = useSelector((state) => state.user);

  let userEmail = 'Not logged in';
  if (currentUser?.token) {
    try {
      const decodedToken = jwtDecode(currentUser.token);
      userEmail = decodedToken.email;
    } catch (error) {
      console.error('Failed to decode token', error);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      <p>Email: {userEmail}</p>
    </div>
  );
};

export default UserInfo;
