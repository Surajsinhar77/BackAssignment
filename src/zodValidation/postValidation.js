const { z } = require("zod");

const createNewPostSchema = z.object({
    stockSymbol : z.string().max(7, "Stock Symbol should not be more than 7 characters"),
    title : z.string().max(
        100,
        "Title should not be more than 100 characters"
    ),
    description : z.string().max(
        1000,
        "Description should not be more than 1000 characters"
    ),
    tags : z.array(z.string()),
});


const getAllPostsSchema = z.object({
    stockSymbol: z.string().optional(),
    tags: z.string().optional(),
    sortBy: z.string().optional(),
})


module.exports = {
    createNewPostSchema,
    getAllPostsSchema
}

