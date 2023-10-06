import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {HTTP} from "../Error/mainError"
import { streamUpload } from "../utils/upload";

const prisma = new PrismaClient()

export const createPost = async(req : any, res : Response) =>{
    try {
        const {userID} = req.params
        const {message} = req.body

        const user = await prisma.authModel.findUnique({
        where : {id : userID},
        include : {posts : true}
        })

        const {secure_url, public_id} : any= await streamUpload(req)

        if (user) {
            const post = await prisma.postModel.create({
                data : {
                    message, userID, image : secure_url, imageID : public_id,
                }
            })

            user?.posts.push(post)
            
            return res.status(HTTP.CREATED).json({
                message : "Post created successfully",
                data : user?.posts
            })

        } else {
            return res.status(HTTP.BAD).json({
                message : "User Not Found"
            })
            
        }

    } catch (error : any) {
        return res.status(HTTP.BAD).json({
            message : "Error creating post",
            data : error.message
        })
    }
}

export const allPosts = async(req : any, res : Response) =>{
    try {
        const {userID} = req.params

        const user = await prisma.authModel.findUnique({
        where : {id : userID}
        })

        if (user) {
            const post = await prisma.postModel.findMany({})

            
            return res.status(HTTP.OK).json({
                message : "Posts viewed successfully",
                data : post
            })

        } else {
            return res.status(HTTP.BAD).json({
                message : "User Not Found"
            })
            
        }

    } catch (error : any) {
        return res.status(HTTP.BAD).json({
            message : "Error creating post",
            data : error.message
        })
    }
}

export const onePost = async(req : any, res : Response) =>{
    try {
        const {postID, userID} = req.params

        const user = await prisma.authModel.findUnique({
        where : {id : userID}
        })

        if (user) {
            const post = await prisma.postModel.findUnique({
                where : {id : postID},

            })

            return res.status(HTTP.OK).json({
                message : "Post viewed successfully",
                data : post
            })

        } else {
            return res.status(HTTP.BAD).json({
                message : "User Not Found"
            })
            
        }

    } catch (error : any) {
        return res.status(HTTP.BAD).json({
            message : "Error creating post",
            data : error.message
        })
    }
}

export const deletePost = async(req : any, res : Response) =>{
    try {
        const {postID, userID} = req.params

        const user = await prisma.authModel.findUnique({
        where : {id : userID}
        })

        if (user) {
            const post = await prisma.postModel.findUnique({
                where : {id : postID}
            })

            if (user?.id === post?.userID) {

                const posted = await prisma.postModel.delete({
                    where : {id : postID},
    
                })

                return res.status(HTTP.OK).json({
                message : "Post deleted successfully",
                data : posted
            })

            } else {
                return res.status(HTTP.BAD).json({
                message : "Ure not Authorized to delete"
            })
            }

        } else {
            return res.status(HTTP.BAD).json({
                message : "User Not Found"
            })
            
        }

    } catch (error : any) {
        return res.status(HTTP.BAD).json({
            message : "Error creating post",
            data : error.message
        })
    }
}
export const updatePost = async(req : any, res : Response) =>{
    try {
        const {postID, userID} = req.params
        const {message} = req.body

        const user = await prisma.authModel.findUnique({
        where : {id : userID},
        include : {posts : true}
        })

        const {secure_url, public_url} : any= await streamUpload(req)

        if (user) {
            const post = await prisma.postModel.findUnique({
                where : {id : postID}
            })

            if (user?.id === post?.userID) {

                const posted = await prisma.postModel.update({
                    where : {id : postID},
                    data : {
                        message, userID, image : secure_url, imageID : public_url,
                    }
                })

                return res.status(HTTP.OK).json({
                message : "Post updated successfully",
                data : posted
            })

            } else {
                return res.status(HTTP.BAD).json({
                message : "Ure not Authorized to delete"
            })
            }

        } else {
            return res.status(HTTP.BAD).json({
                message : "User Not Found"
            })
            
        }

    } catch (error : any) {
        return res.status(HTTP.BAD).json({
            message : "Error creating post",
            data : error.message
        })
    }
}