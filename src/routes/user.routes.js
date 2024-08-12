import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)//so url formed will be like http://localhost:3000/api/v1/users/register

export default router