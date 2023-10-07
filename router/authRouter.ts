import express from "express";
import { allUsers, changePassword, deleteUser, forgotPassword, oneUser, register, signIn, updateUserAvatar, updateUserInfo, verifyuser } from "../controller/authController";

import multer from "multer";
import validateHolder from "../utils/validateHolder";
import { createUser } from "../utils/validate";

const myUpload = multer().single("image")

const router = express.Router()

router.route("/all-users").get(allUsers)
router.route("/:userID/one-user").get(oneUser)

router.route("/register").post(validateHolder(createUser), register)
router.route("/sign-in").post(signIn)

router.route("/:token/verify").patch(verifyuser)
router.route("/forgot-password").patch(forgotPassword)
router.route("/:token/change-password").patch(changePassword)
router.route("/:token/update-info").patch(updateUserInfo)
router.route("/:token/update-avatar").patch(myUpload,updateUserAvatar)

router.route("/:userID/delete-user").delete(deleteUser)

export default router