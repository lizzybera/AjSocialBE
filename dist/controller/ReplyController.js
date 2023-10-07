"use strict";
// import { PrismaClient } from "@prisma/client";
// import { Request, Response } from "express";
// import { HTTP } from "../Error/mainError";
// const prisma = new PrismaClient()
// export const replyComment =async (req:Request,res:Response ) => {
//  try {
//     const {userID, postID, commentID} = req.params;
//     const  { reply } = req.body;
//     const user  = await prisma.authModel.findUnique({
//         where: { id: userID  }
//     })
//     if (user) {
//         const comment : any = await prisma.commentModel.findUnique({
//             where: {  id: commentID }
//         })
//         const replied = await prisma.replyModel.create({
//             data: { reply, userID}
//         })
//         comment?.replies.push(replied);
//         comment.save()
//         return res.status(HTTP.OK).json({
//             message: 'Replied comment successfully',
//             data: replied
//         })
//     } else {
//         return res.status(HTTP.BAD).json({
//             message : "user  not found"
//         })
//     }
//  } catch (error) {
//     return res.status(HTTP.BAD).json({
//         message : "Error Repling comment",
//         data : error
//     })
//  }   
// }
// export const deleteReply =async (req:Request, res:Response) => {
//     try {
//         const {userID,replyID} = req.params;
//         const user = await prisma.authModel.findUnique({
//             where : {id : userID}
//         })
//         if (user) {
//             const reply  : any = await prisma.replyModel.findUnique({
//                 where : {id : userID}
//             })
//             if (user.id === reply.userID) {
//                 const deleted = await prisma.replyModel.delete({
//                     where : {id : replyID}
//                 })
//             } else {
//                 return res.status(HTTP.BAD).json({
//                     message : 'user not found'
//                 })
//                         }
//                         return res.status(HTTP.OK).json({
//                             message : 'Reply deleted'
//                         })
//         } else {
//             return res.status(HTTP.BAD).json({
//                 message : 'user not found'
//             })
//         }
//     } catch (error) {
//         return res.status(HTTP.BAD).json({
//             message : 'Error deleting Reply'
//         })
//     }
// }
