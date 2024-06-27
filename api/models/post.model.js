import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
    min: [0, 'Starting price must be a positive number.'],
  },
  auctionDays: {
    type: Number,
    required: true,
    min: [1, 'Auction days must be a positive number greater than zero.'],
  },
  images: [{
    type: String,
    required: true,
  }],
  sellerEmail: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address.'],
  },
  highestBidderEmail: {
    type: String,
    match: [/.+@.+\..+/, 'Please enter a valid email address.'],
    default: null,
  },
  highestBidPrice: {
    type: Number,
    default: 0,
  },
  dateOfPost: {
    type: Date,
    default: Date.now,
  },
  saleExpirationDate: {
    type: Date,
    required: true,
  },
});

postSchema.pre('validate', function (next) {
  if (this.isNew) {
    this.saleExpirationDate = new Date(this.dateOfPost.getTime() + this.auctionDays * 24 * 60 * 60 * 1000);
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
