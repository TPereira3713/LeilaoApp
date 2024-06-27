import React from 'react';
import { NavLink } from 'react-router-dom';

const ProfileNavbar = () => {
  return (
    <nav className="w-64 h-screen bg-gray-800 text-white fixed">
      <ul className="mt-8">
        <li className="mb-2">
          <NavLink
            to="/profile/user-info"
            activeClassName="bg-gray-700"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            User Information
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/profile/account-settings"
            activeClassName="bg-gray-700"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Account Settings
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/profile/my-posts"
            activeClassName="bg-gray-700"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            My Posts
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/profile/my-bids"
            activeClassName="bg-gray-700"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            My Bids
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavbar;
