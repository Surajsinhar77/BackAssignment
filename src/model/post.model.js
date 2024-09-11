const mongoose = require('mongoose');   


const postSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    stockSymbol: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      }
    ],

    likesCount: {
      type: Number,
      default: 0,
    },
  },
    { timestamps: true }
);

postSchema.index({ title: 'text', description: 'text', tags: 'text' });

postSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }
  next();
});


const Post = mongoose.model('Posts', postSchema);
module.exports = Post;
  