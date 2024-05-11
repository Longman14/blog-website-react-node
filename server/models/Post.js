const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true }, // Author will be the username of the post maker
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
  content: { type: String },
  comments: [{
    content: { type: String },
    author: { type: String }, // Author will be the username of the comment maker
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date },
  }]
});

module.exports = mongoose.model('Post', postSchema);
