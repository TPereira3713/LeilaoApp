import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const signup = async (req, res, next) => {
  const { email, password, name, homeAddress, postalCode, cellphone } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 12);

  try {
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      homeAddress,
      postalCode,
      cellphone
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code && error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200)
      .cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      .json({ message: 'Sign in successful', token });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user; // Assuming you have middleware that sets req.user

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = bcryptjs.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = bcryptjs.hashSync(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
