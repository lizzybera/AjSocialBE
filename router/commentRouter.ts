import express, { Router } from "express";
import {
  createComment,
  readComment,
  readOneComment,
 
} from "../controller/commentController";

const router: Router = express.Router();

router.route("/:userID/:articleID/create-comment").post(createComment);

router.route("/comments").get(readComment);

router.route("/:commentID/comment-detail").get(readOneComment);

export default router;
