"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.deletePost = exports.onePost = exports.allPosts = exports.createPost = void 0;
const client_1 = require("@prisma/client");
const mainError_1 = require("../Error/mainError");
const upload_1 = require("../utils/upload");
const prisma = new client_1.PrismaClient();
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { message } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
            include: { posts: true }
        });
        const { secure_url, public_id } = yield (0, upload_1.streamUpload)(req);
        if (user) {
            const post = yield prisma.postModel.create({
                data: {
                    message, userID, image: secure_url, imageID: public_id,
                }
            });
            user === null || user === void 0 ? void 0 : user.posts.push(post);
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "Post created successfully",
                data: user === null || user === void 0 ? void 0 : user.posts
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD).json({
                message: "User Not Found"
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error creating post",
            data: error.message
        });
    }
});
exports.createPost = createPost;
const allPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID }
        });
        if (user) {
            const post = yield prisma.postModel.findMany({});
            return res.status(mainError_1.HTTP.OK).json({
                message: "Posts viewed successfully",
                data: post
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD).json({
                message: "User Not Found"
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error creating post",
            data: error.message
        });
    }
});
exports.allPosts = allPosts;
const onePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID }
        });
        if (user) {
            const post = yield prisma.postModel.findUnique({
                where: { id: postID },
            });
            return res.status(mainError_1.HTTP.OK).json({
                message: "Post viewed successfully",
                data: post
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD).json({
                message: "User Not Found"
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error creating post",
            data: error.message
        });
    }
});
exports.onePost = onePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID }
        });
        if (user) {
            const post = yield prisma.postModel.findUnique({
                where: { id: postID }
            });
            if ((user === null || user === void 0 ? void 0 : user.id) === (post === null || post === void 0 ? void 0 : post.userID)) {
                const posted = yield prisma.postModel.delete({
                    where: { id: postID },
                });
                return res.status(mainError_1.HTTP.OK).json({
                    message: "Post deleted successfully",
                    data: posted
                });
            }
            else {
                return res.status(mainError_1.HTTP.BAD).json({
                    message: "Ure not Authorized to delete"
                });
            }
        }
        else {
            return res.status(mainError_1.HTTP.BAD).json({
                message: "User Not Found"
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error creating post",
            data: error.message
        });
    }
});
exports.deletePost = deletePost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = req.params;
        const { message } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
            include: { posts: true }
        });
        const { secure_url, public_url } = yield (0, upload_1.streamUpload)(req);
        if (user) {
            const post = yield prisma.postModel.findUnique({
                where: { id: postID }
            });
            if ((user === null || user === void 0 ? void 0 : user.id) === (post === null || post === void 0 ? void 0 : post.userID)) {
                const posted = yield prisma.postModel.update({
                    where: { id: postID },
                    data: {
                        message, userID, image: secure_url, imageID: public_url,
                    }
                });
                return res.status(mainError_1.HTTP.OK).json({
                    message: "Post updated successfully",
                    data: posted
                });
            }
            else {
                return res.status(mainError_1.HTTP.BAD).json({
                    message: "Ure not Authorized to delete"
                });
            }
        }
        else {
            return res.status(mainError_1.HTTP.BAD).json({
                message: "User Not Found"
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error creating post",
            data: error.message
        });
    }
});
exports.updatePost = updatePost;
