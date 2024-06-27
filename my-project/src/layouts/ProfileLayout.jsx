import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileNavbar from '../pages/ProfileNavbar';
import UserInfo from '../components/profile/UserInfo';
import AccountSettings from '../components/profile/AccountSettings';
import MyPosts from '../components/profile/MyPosts';
import MyBids from '../components/profile/MyBids';

const ProfileLayout = () => {
  return (
    <div className="flex">
      <ProfileNavbar />
      <div className="flex-grow p-4 ml-64">
        <Routes>
          <Route path="user-info" element={<UserInfo />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="my-posts" element={<MyPosts />} />
          <Route path="my-bids" element={<MyBids />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProfileLayout;
