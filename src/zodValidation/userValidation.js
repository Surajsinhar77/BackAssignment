const {z} = require('zod');

const userSchemaForRegister = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(255),
});


const userSchemaForLogin = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(255),
});


const userSchemaForUpdate = z.object({
    username: z.string().min(3).max(20).optional(),
    bio: z.string().max(100).optional(),
}).refine(obj => Object.keys(obj).length > 0, {
    message: "At least one field should be present to be updated",
});


module.exports = {
    userSchemaForRegister,
    userSchemaForLogin,
    userSchemaForUpdate
};
