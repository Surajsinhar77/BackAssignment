const router = require('express').Router();
const { authentication } = require('../middleware/authMiddleware');

const { createNewPost ,getAllPosts, getPostById, deletePostById } = require('../controller/post.controller'); 
const { createNewComment,deleteCommentById, likePost, unLikePost } = require('../controller/comment.controller');


router.use(authentication);

router.route('/').post(createNewPost);
router.route('/').get(getAllPosts);
router.route('/:postId').get(getPostById);
router.route('/:postId').delete(deletePostById);
router.route('/:postId/comments').post(createNewComment);
router.route('/:postId/comments/:commentId').delete(deleteCommentById);
// This one is also enough for like and dislike with get Method
router.route('/:postId/like').post(likePost);
router.route('/:postId/like').delete(unLikePost);

module.exports = router;