import express from 'express';
import { signup, signin, changePassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/change-password', changePassword);

export default router;
