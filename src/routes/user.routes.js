import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)//so url formed will be like http://localhost:3000/api/v1/users/register

export default router