import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true//for any field to be optimized searchable, make index true 
        //bohot soch samaj ke index ko true karna warna bohot expensive ho jayega
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,//keep the images to cloudinary url and paste the links here
        required: true,
    },
    coverImage: {
        type: String//cloudinary url
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,//bcrypt library is used to encrypt and decrypt the password before storing it to mongo because database leaks happens sometimes
        //JsonWebToken(JWT) is also used in this 
        //jwt creates the token using the encryption method, data, private key.
        //this token is share to the user and can be verified using the prive key which is only with the verified person. 

        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true })

userSchema.pre("save", async function (next) {//here pre is used for execution just before saving the data
    // async is because it take some time for encrypting and processing the data
    //here in callback arrow functions are avoided because we have to use "this" for the reference of the above schema which can't be done by arrow so normal function is used 
    //error, request, response, (next)--->this next is used.so after the work is done next is called and flag is passed further.

    if (!this.isModified("password")) return next();//this is for the blockage, it will only run if there is any modification in password field 
    //isModified is predefined function and string is taken as input

    this.password = await bcrypt.hash(this.password, 10)//this 10 is number of rounds for encryption
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {//creating custom method
    return await bcrypt.compare(password, this.password)//this will give boolean output
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,//this id is generated by mongo
            email: this.email,
            usename: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefereshToken = function () {//referesh token generation is excatly same as that of access token but the fields are less
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFERESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFERESH_TOKEN_EXPIRY
        }
    )
}
//Access tokens are of short duration but referesh tokens are long duration tokens
//i.e. Access tokens expires in 15 minutes so session will last 15 min after that you need to enter password again
//but if there is an feature of referesh token that lasts 1 year so you dont need to write password again and again 
//although the session expires but if you hit the end point, you will be allowed to login and provide new access token after validating the referesh tokens at both the sides

export const User = mongoose.model('User', userSchema)