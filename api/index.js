import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './utils/error.js';

const app = express();

app.use(express.json());

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });

//Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

//middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
