import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //Get Users data from frontend
    //validate - not empty 
    //check if user already exist or not:username, email
    //check for images and avatar
    //upload to cloudinary
    //create user object- enter it to db
    //remove password and referesh token field from response
    //check for user creation
    //return response

    const { username, email, fullName, password } = req.body//req.body is provided by express

    if ([username, email, password, fullName].some((field) => field?.trim() === "")) {//checks if all the required fields are filled, can also do it one by one using if else
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]//for checking multiple variables from db
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or Username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path//req.files is provided by multer,avatar is used because its named like this in the routes file
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is Required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,//because we have exported whole response from cloudinay file and here we want only url of the avatar to be stored in db
        coverImage: coverImage?.url || "",//because coverImage is optional field
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"//this syntax is wierd in string seperated by spaces and minus represents to remove it
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went Wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )
})

export { registerUser }