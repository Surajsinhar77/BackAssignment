const postModel = require("../model/post.model");
const responseUtil = require("../utils/responseUtils");
const { createNewPostSchema, getAllPostsSchema } = require("../zodValidation/postValidation");
const commentModel = require("../model/comment.model");


const createNewPost = async (req, res) => {
    try {
        const { stockSymbol, title, description, tags } = createNewPostSchema.parse(
            req.body
        );

        const newPost = new postModel({
            userId: req.user._id,
            stockSymbol,
            title,
            description,
            tags,
        });
        const result = await newPost.save();
        responseUtil.successResponseWithMsgAndData(
            res,
            "Post created successfully",
            {postId: result._id}
        );
    } catch (err) {
        responseUtil.errorResponse(res, err.message);
    }
};

const getAllPosts = async (req, res) => {
    try {
        const { stockSymbol, tags, sortBy } = getAllPostsSchema.parse(req.query);
        // make a pagination with limits and page number and both should be optional

        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        let query = {};

        if (stockSymbol) {
            query.stockSymbol = stockSymbol;
        }

        if (tags) {
            query.tags = { $in: tags.split(",") };
        }

        let sortCriteria = {};
        if (sortBy === "likes") {
            sortCriteria.likesCount = -1; // Sort by likes in descending order
        }else if (sortBy === "date") {
            sortCriteria.createdAt = -1; // Sort by date in descending order
        }

        const posts = await postModel
            .find(query)
            .sort(sortCriteria)
            .limit(limit)
            .skip((page - 1) * limit)
            .select("_id stockSymbol title description likesCount createdAt");
        
        responseUtil.successResponseWithData(res, {posts, page, limit});
    } catch (error) {
        responseUtil.errorResponse(res, error.message);
    }
};

const getPostById = async (req, res) => {
    try{
        const postId = req.params.postId;
        const post = await postModel.findById(postId).select('_id stockSymbol title description likesCount').exec();

        if(!post){
            throw new Error("Post not found");
        }
        
        const comments = await commentModel.find({postId}).exec();

        responseUtil.successResponseWithData(res, {post, comments});
    }catch(err){
        responseUtil.errorResponse(res, err.message);           
    }
}


const deletePostById = async (req, res) => {
    try{
        const postId = req.params.postId;
        const post = await postModel.findByIdAndDelete(postId).exec();
        if(!post){
            throw new Error("Post not found");
        }
        responseUtil.successResponse(res, "Post deleted successfully");
    }catch(err){
        responseUtil.errorResponse(res, err.message);           
    }
}

module.exports = {
    createNewPost,
    getAllPosts,
    getPostById,
    deletePostById
}