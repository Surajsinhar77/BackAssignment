const { uploadOnCloudinary } = require("../middleware/fileUploaderMiddleware");
const {
  userSchemaForRegister,
  userSchemaForLogin,
  userSchemaForUpdate,
} = require("../zodValidation/userValidation");


const userModel = require("../model/user.model");
const TokenUtils = require("../utils/tokenUtils");
const ResponseUtils = require("../utils/responseUtils");
const bcrypt = require("bcrypt");
const { token } = require("morgan");

const register = async (req, res) => {
  try {
    const { username, email, password } = userSchemaForRegister.parse(req.body);

    const userExist = await userModel.findOne({$or: [{ email }, { username }] }).exec();
    if (userExist) {
      ResponseUtils.validationError(res, "User already exists with this email");
      return;
    }
    if (userExist) {
      return ResponseUtils.validationError(res, "User already exist with this email");
    }


    const user = new userModel({
      username,
      email,
      password : await bcrypt.hash(password, 10),
    });

    const { accessToken, refreshToken } = TokenUtils.generateAuthToken({
      _id: user._id,
      username,
      email,
    });
    user.token = refreshToken;
    await user.save();
    TokenUtils.setTokenCookies(res, accessToken, refreshToken);
    res.header("Authorization", `Bearer ${accessToken}`);
    return ResponseUtils.successResponseWithMsgAndData(
      res,
      {userId : user._id},
      "User registered successfully"
    );
  } catch (error) {
    ResponseUtils.errorResponse(res, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = userSchemaForLogin.parse(req.body);

    const user = await userModel.findOne({ email }).select("+password").exec();

    if (!user) {
      return ResponseUtils.validationError(res, "Invalid email");
    }
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return ResponseUtils.validationError(res, "Password invalid");
    }
    const { accessToken, refreshToken } = TokenUtils.generateAuthToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    user.token = refreshToken;
    await user.save();

    res.header("Authorization", `Bearer ${accessToken}`);
    await TokenUtils.setTokenCookies(res, accessToken, refreshToken);
    
    return ResponseUtils.successResponseWithData(res, {
      token: accessToken,
      user : {_id: user._id,
      username: user.username,
      email: user.email},
    });
  } catch (error) {
    return ResponseUtils.errorResponse(res, error.message);
  }
};

const userProfileUpdate = async (req, res) => {
  try {
    const { username, bio } = userSchemaForUpdate.parse(req.body);

    const user = await userModel.find({ username }).exec();

    if(user.length > 0){
      return ResponseUtils.validationError(res, "Username already exists");
    }

    if (req.file) {
      const profilePicturePath = req.file.path;
      var { public_id, publicUrl } = await uploadOnCloudinary(
        profilePicturePath
      );
    }

    await userModel.findByIdAndUpdate(
      req.user._id,
      { username, bio, profilePicture: publicUrl },
      { new: true }
    );
    ResponseUtils.successResponse(res, "Profile updated successfully");
  } catch (error) {
    ResponseUtils.errorResponse(res, error.message);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.usedId).select("-password -token -__v -email -updatedAt").exec();
    ResponseUtils.successResponseWithData(res, user);
  } catch (error) {
    ResponseUtils.errorResponse(res, error.message);
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    res.header("Authorization", "");
    await TokenUtils.removeTokenCookies(res, userId);
    return ResponseUtils.successResponse(res, "User logged out successfully");
  } catch (error) {
    ResponseUtils.errorResponse(res, error.message);
  }
}

const refreshToken = async (req, res) => {
  try{
    const oldRefreshToken = req.cookies.refreshToken;
    if(!oldRefreshToken){
      return ResponseUtils.unauthorizedResponse(res, "Unauthenticated");
    }

    const verifyRefreshToken = TokenUtils.verifyRefreshToken(oldRefreshToken);
    if(!verifyRefreshToken){
      return ResponseUtils.unauthorizedResponse(res, "Unauthenticated");
    }

    const user = await userModel.findById(verifyRefreshToken._id).select('-password -token -__v') .exec();

    const { accessToken, refreshToken } = TokenUtils.generateAuthToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    user.token = refreshToken;
    await user.save();
    await TokenUtils.setTokenCookies(res, accessToken, refreshToken);
    res.header("Authorization", `Bearer ${accessToken}`);
    ResponseUtils.successResponseWithData(res, accessToken);
  }catch(error){
    ResponseUtils.errorResponse(res, error.message);
  }
}

module.exports = {
  register,
  login,
  userProfileUpdate,
  getProfile,
  logout,
  refreshToken,
};


