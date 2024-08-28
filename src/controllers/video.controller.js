import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination


})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    if ([title, description].some((field) => field?.trim() === "")) {
        throw ApiError(401, "title and description are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath) {
        throw ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw ApiError(400, "thumbnai is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw ApiError(400, "Video file is required")
    }

    if (!thumbnail) {
        throw ApiError(400, "thumbnail is required")
    }

    const duration = videoFile.duration

    if (!duration) {
        throw ApiError(500, "failed to fetch duration of video")
    }

    const userId = req.body.userId; // Assume the user's ID is sent in the request body

    const user = await User.findById(userId);

    console.log(user);

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration,
        views: 0,
        isPublished: true,
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { video }, "Video published Successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!videoId?.trim()) {
        throw new ApiError(401, "videoId is missing")
    }

    const video = await Video.findById(videoId?.trim())

    if (!video) {
        throw ApiError(401, "video does not exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { video }, "video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description, thumbnail } = req.body


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
