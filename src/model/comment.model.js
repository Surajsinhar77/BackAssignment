const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    
}, {timestamps: true}
);

module.exports = mongoose.model("Comments", commentSchema);
