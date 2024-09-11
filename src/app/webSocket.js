// const io = require("./app").io;
// const postModel = require("../model/post.model");

// // WebSocket connection handler
// io.on('connection', (socket) => {
//     console.log('New client connected');

//     // WebSocket event for liking a post
//     socket.on('likePost', async ({ postId, userId }) => {
//         try {
//             const post = await postModel.findById(postId);
//             if (!post) {
//                 return socket.emit('error', { message: 'Post not found' });
//             }
//             if (post.likes.includes(userId)) {
//                 return socket.emit('error', { message: 'You already liked this post' });
//             }
//             post.likes.push(userId);
//             post.CountLikes();
//             await post.save();
//             io.emit('postLiked', { postId, likesCount: post.likesCount });
//         } catch (error) {
//             socket.emit('error', { message: error.message });
//         }
//     });

//     socket.on('message', (data) => {
//         console.log(data);
//     })

//     // WebSocket event for adding a comment
//     socket.on('addComment', async ({ postId, userId, comment }) => {
//         try {
//             const post = await postModel.findById(postId);
//             if (!post) {
//                 return socket.emit('error', { message: 'Post not found' });
//             }
//             post.comments.push({ comment, userId });
//             await post.save();
//             io.emit('commentAdded', { postId, comment, userId });
//         } catch (error) {
//             socket.emit('error', { message: error.message });
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

// // HTTP endpoint for liking a post
// app.post('/api/posts/:postId/like', async (req, res) => {
//     try {
//         const { postId } = req.params;
//         const userId = req.body.userId; // Assume userId is sent in the request body
//         const post = await postModel.findById(postId);
//         if (!post) {
//             return res.status(404).send({ message: 'Post not found' });
//         }
//         if (post.likes.includes(userId)) {
//             return res.status(400).send({ message: 'You already liked this post' });
//         }
//         post.likes.push(userId);
//         post.CountLikes();
//         await post.save();
//         io.emit('postLiked', { postId, likesCount: post.likesCount });
//         res.status(200).send({ message: 'Post liked', likesCount: post.likesCount });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// });

// // HTTP endpoint for adding a comment
// app.post('/api/posts/:postId/comment', async (req, res) => {
//     try {
//         const { postId } = req.params;
//         const { comment, userId } = req.body;
//         const post = await postModel.findById(postId);
//         if (!post) {
//             return res.status(404).send({ message: 'Post not found' });
//         }
//         post.comments.push({ comment, userId });
//         await post.save();
//         io.emit('commentAdded', { postId, comment, userId });
//         res.status(200).send({ message: 'Comment added' });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// });

// // server.listen(3000, () => {
// //     console.log('Server running on port 3000');
// // });
