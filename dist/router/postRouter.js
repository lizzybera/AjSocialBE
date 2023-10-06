"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const postController_1 = require("../controller/postController");
const myUpload = (0, multer_1.default)().single("image");
const router = express_1.default.Router();
router.route("/:userID/all-posts").get(postController_1.allPosts);
router.route("/:userID/:postID/one-post").get(postController_1.onePost);
router.route("/:userID/post").post(myUpload, postController_1.createPost);
router.route("/:userID/:postID/update-post").patch(myUpload, postController_1.updatePost);
router.route("/:userID/:postID/delete-post").delete(postController_1.deletePost);
exports.default = router;
