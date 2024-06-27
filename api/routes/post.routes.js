import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { post, getAllPosts, getPostById, placeBid } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, post);

router.get('/posts', getAllPosts);

router.get('/:postId', getPostById);

router.put('/:postId/bid', verifyToken, placeBid);


export default router;
