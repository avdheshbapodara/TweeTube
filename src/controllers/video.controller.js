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
        throw ApiError(400, "thumbnail is required")
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
    const { title, description } = req.body

    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is missing")
    }

    const videoFound = await Video.findById(videoId?.trim())

    if (!videoFound) {
        throw ApiError(401, "video does not exist")
    }

    const thumbnailLocalPath = req.file?.path

    let thumbnailUrl

    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if (!thumbnail) {
            throw ApiError(400, "error while uploading thumbnail")
        }

        thumbnailUrl = thumbnail.url
    }

    let updatedFields = {}

    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (thumbnailUrl !== undefined) updatedFields.thumbnail = thumbnailUrl;

    if (!(title || description || thumbnailUrl)) {
        throw new ApiError(400, "At least one field (title, description, or thumbnail) must be provided to update the video.")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updatedFields
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, { video }, "Updated video successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // TODO: delete video
    if (!videoId?.trim()) {
        throw ApiError(400, "videoId is missing")
    }

    const result = await Video.findByIdAndDelete(videoId)

    if (!result) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId?.trim()) {
        throw ApiError(400, "Video Id is missing")
    }

    const video = await Video.findById(videoId.trim())

    if (!video) {
        throw ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished


    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: video.isPublished
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, { updatedVideo }, "Status Toggled successfully"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
