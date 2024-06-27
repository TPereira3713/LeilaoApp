import Post from '../models/post.model.js';
import { createError } from '../utils/error.js';

export const post = async (req, res, next) => {
  console.log('req.user:', req.user);
  const { productName, startingPrice, auctionDays, images } = req.body;

  if (!productName || !startingPrice || !auctionDays || !images) {
    return next(createError(400, 'Please provide all required fields'));
  }

  if (!req.user || !req.user.id || !req.user.email) {
    return next(createError(400, 'User information is missing.'));
  }

  const newPost = new Post({
    productName,
    startingPrice,
    auctionDays,
    images,
    userId: req.user.id,
    sellerEmail: req.user.email,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).exec();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const placeBid = async (req, res, next) => {
  const { postId } = req.params;
  const { bidPrice } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId === req.user.id) {
      return res.status(400).json({ error: 'You cannot bid on your own item' });
    }

    if (bidPrice <= post.highestBidPrice) {
      return res.status(400).json({ error: 'Bid price must be higher than current highest bid' });
    }

    post.highestBidPrice = bidPrice;
    post.highestBidderEmail = req.user.email;

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};