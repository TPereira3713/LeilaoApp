import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignInForm from './pages/SignInForm';
import SignUpForm from './pages/SignUpForm';
import HomePage from './pages/HomePage';
import ProfileLayout from './layouts/ProfileLayout';
import PrivateRoute from './components/PrivateRoute';
import AuctionForm from './pages/AuctionForm';
import ItemPage from './pages/Itempage';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/item/:postId" element={<ItemPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile/*" element={<ProfileLayout />} />
          <Route path="/post" element={<AuctionForm />} />
        </Route>
      </Routes>
    </Router>
  );
}
