const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post must have a title']
  },
  body: {
    type: String,
    required: [true, 'Post must have a body']
  }
});

// Post is the name of the model, the name in mogoDB will be 'posts'
const Post = mongoose.model('Post', postSchema);

module.exports = Post;