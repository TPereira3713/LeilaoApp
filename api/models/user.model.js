import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true
  },
  homeAddress: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true,
    match: /^\d{5}$/
  },
  cellphone: {
    type: String,
    required: true,
    match: /^\+?[0-9]{10,15}$/
  }
}, {timestamps: true}
);

const User = mongoose.model('User', userSchema);

export default User;
