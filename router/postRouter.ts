import express from "express";

import multer from "multer";
import { allPosts, createPost, deletePost, onePost, updatePost } from "../controller/postController";

const myUpload = multer().single("image")

const router = express.Router()

router.route("/:userID/all-posts").get(allPosts)
router.route("/:userID/:postID/one-post").get(onePost)

router.route("/:userID/post").post(myUpload,createPost)

router.route("/:userID/:postID/update-post").patch(myUpload, updatePost)

router.route("/:userID/:postID/delete-post").delete(deletePost)

export default router