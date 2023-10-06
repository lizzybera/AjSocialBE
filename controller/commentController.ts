import {Request , Response} from "express"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export const makeComment = async(req : Request , res : Response) => {
    try {
        const { userID , postID } = req.params
        const { comment } = req.body;

        const user = await prisma.authModel.findUnique({
            where : {id : userID}
        })

        if (user) {
            const post : any = await prisma.postModel.findUnique({
                where : {id : postID}
            })

            const userComment = await prisma.commentModel.create({
                data : {
                    comment,
                    userID
                }
            })
            post?.comments.push(userComment)
        } else {
            return res.status(400).json({
                message : "User Not Found"
            })
        }
        return res.status(200).json({
            message : "Comment Made Successfully"
        })
    } catch (error) {
        return res.status(400).json({
            message : "Error Making Comment",
            data : error
        })
    }
}

export const likeComment = async(req : Request , res : Response) => {
    try {
        const { userID , postID , commentID} = req.params

        const user = await prisma.authModel.findUnique({
            where : {id : userID}
        })

        if (user) {
           const comment : any = await prisma.commentModel.findUnique({
            where : { id : commentID}
           })

           comment?.likes.push(userID)
        } else {
            return res.status(400).json({
                message : "User Not Found"
            })
        }

        return res.status(200).json({
            message : "Liked Comment Successfully"
        })
    } catch (error) {
        return res.status(400).json({
            message : "Error Liking Comment",
            data : error
        })
    }
}

export const unLikeComment = async(req : Request , res : Response) => {
    try {
        const { userID , postID , commentID} = req.params

        const user = await prisma.authModel.findUnique({
            where : {id : userID}
        })

        if (user) {
           const comment : any = await prisma.commentModel.findUnique({
            where : { id : commentID}
           })

           comment?.likes.pull(userID)
        } else {
            return res.status(400).json({
                message : "User Not Found"
            })
        }

        return res.status(200).json({
            message : "unLiked Comment Successfully"
        })
    } catch (error) {
        return res.status(400).json({
            message : "Error Unliking Comment",
            data : error
        })
    }
}

export const deleteComment = async(req : Request , res : Response) => {
    try {
        const { userID , postID , commentID} = req.params;

        const user = await prisma.authModel.findUnique({
            where : { id : userID }
        })

        if (user) {
            const comment : any = await prisma.commentModel.findUnique({
                where : {id : commentID}
            })
            if (user.id === comment.userID) {
            const deleted = await prisma.commentModel.delete({
                where : {id : commentID}
            })
            } else {
                return res.status(400).json({
                    message : "Na you make the comment??? "
                })
            }
        } else {
            return res.status(400).json({
                message : "User Not Found"
            })
        }

        return res.status(200).json({
            message : "Deleted Comment Successfully"
        })
    } catch (error) {
        return res.status(400).json({
            message : "Error Deleting Comment",
            data : error
        })
    }
}