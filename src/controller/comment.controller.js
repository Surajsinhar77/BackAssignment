const commentModel = require("../model/comment.model");
const { z } = require("zod");
const responseUtil = require("../utils/responseUtils");
const postModel = require("../model/post.model");
const io = require("../app/app").io;

const commentNamespace = io.of('/commentsAndLikes');

commentNamespace.on('connection', (socket) => {
    console.log('New client connected to comments namespace');

    // Emit events only when there are active clients in this namespace
    socket.on('newComment', (data) => {
        console.log('New comment data:', data);
        commentNamespace.emit('postLiked', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected from comments namespace');
    });
});

// Ensure you only emit when there are active clients
const emitToClients = (namespace, event, data) => {
    if (namespace.sockets.size > 0) {
        namespace.emit(event, data);
    } else {
        console.log(`No active clients in namespace ${namespace.name}`);
    }
};



const createNewComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const createNewCommentSchema = z.object({
            comment: z.string().min(1, "Comment should not be empty"),
        });
        const { comment } = createNewCommentSchema.parse(req.body);

        const newComment = new commentModel({
            postId,
            userId: req.user._id,
            comment,
        });

        const result = await newComment.save();

        const allNewComments = await commentModel.find({ postId });
        emitToClients(commentNamespace, 'newComment', { postId, comments: allNewComments });
        responseUtil.successResponseWithMsgAndData(
            res,{ commentId: result._id },
            "Comment created successfully"
        );
    } catch (error) {
        responseUtil.errorResponse(res, error.message);
    }
};

const deleteCommentById = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;

        const comment = await commentModel.findOne({ _id: commentId, postId });

        if (!comment) {
            return responseUtil.errorResponse(res, "Comment not found");
        }

        if (comment.userId.toString() !== userId) {
            return responseUtil.errorResponse(
                res,
                "Unauthorized to delete this comment",
                403
            );
        }

        await commentModel.deleteOne({ _id: commentId, postId });
        const commentsAfterDelete = await commentModel.find({ postId });
        emitToClients(commentNamespace, 'delComment', { postId, comments: commentsAfterDelete });
        responseUtil.successResponse(res, "Comment deleted successfully");
    } catch (error) {
        responseUtil.errorResponse(res, error.message);
    }
};

const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await postModel.findById(postId);

        if (!post) {
            return responseUtil.errorResponse(res, "Post not found");
        }
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((_id) => _id.toString() !== userId);
            await post.save();
            emitToClients(commentNamespace, 'postUnlike', { postId, likesCount: post.likesCount });
            return responseUtil.successResponse(res, "Post unLike");
        }
        post.likes.push(userId);
        await post.save();
        emitToClients(commentNamespace, 'postLiked', { postId, likesCount: post.likesCount });
        responseUtil.successResponse(res, "Post liked");
    } catch (error) {
        responseUtil.errorResponse(res, error.message);
    }
};

const unLikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await postModel.findById(postId);

        if (!post) {
            return responseUtil.errorResponse(res, "Post not found");
        }

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((_id) => _id.toString() !== userId);
            await post.save();
            emitToClients(commentNamespace, 'postUnlike', { postId, likesCount: post.likesCount });
            return responseUtil.successResponse(res, "Post unLike");
        }
        responseUtil.errorResponse(res, "Post already unliked");
    } catch (error) {
        responseUtil.errorResponse(res, error.message);
    }
};

module.exports = {
    createNewComment,
    deleteCommentById,
    likePost,
    unLikePost,
};
