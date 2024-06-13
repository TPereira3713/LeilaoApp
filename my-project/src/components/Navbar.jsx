import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import defaultAvatar from '../assets/default-avatar.svg'; 

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const handleAvatarClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900">
              LeilaoApp
            </a>
          </div>
          <div className="flex items-center">
            {!currentUser ? (
              <>
                <a
                  href="/login"
                  className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Sign Up
                </a>
              </>
            ) : (
              <div className="relative flex items-center">
                <img
                  src={currentUser.avatar || defaultAvatar}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full border border-gray-300 cursor-pointer"
                  onClick={handleAvatarClick}
                />
                {dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-10 w-48 bg-white border border-gray-200 rounded shadow-lg z-10"
                  >
                    <div className="py-2 px-4">
                      <p className="text-lg text-gray-700">{currentUser.rest.email}</p>
                      <a
                        href="/profile"
                        className="block mt-2 text-blue-500 hover:text-blue-700"
                      >
                        Profile
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left mt-2 text-red-500 hover:text-red-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
