import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const {password: pass, ...rest } = user._doc;

    res.status(200)
      .cookie('access_token', token, { httpOnly: true})
      .json({ message: 'Sign in successful', rest });
  } catch (error) {
    next(error);
  }
};
