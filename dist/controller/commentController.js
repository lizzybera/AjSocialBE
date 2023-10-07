"use strict";
// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import { HTTP } from "../Error/mainError";
// const prisma = new PrismaClient();
// export const createComment = async (req: Request, res: Response) => {
//   try {
//     const { userID, postID } = req.params;
//     const { comment } = req.body;
//     const user = await prisma.authModel.findUnique({
//       where: { id: userID },
//     });
//     if (user) {
//       const post: any = await prisma.postModel.findUnique({
//         where: { id: postID },
//       });
//       const userComment = await prisma.commentModel.create({
//         data: {
//           comment,
//           userID,
//         },
//       });
//       post?.comments.push(userComment);
//     } else {
//       return res.status(400).json({
//         message: "User Not Found",
//       });
//     }
//     return res.status(200).json({
//       message: "Comment Made Successfully",
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: "Error Making Comment",
//       data: error,
//     });
//   }
// };
// export const readComment = async (req: Request, res: Response) => {
//   try {
//     const post = await prisma.commentModel.findMany();
//     return res.status(HTTP.OK).json({
//       message: "Read comment",
//       data: post,
//     });
//   } catch (error) {
//     return res.status(HTTP.BAD).json({
//       message: "unable to read comment",
//     });
//   }
// };
// export const readOneComment = async (req: Request, res: Response) => {
//   try {
//     const { commentID } = req.params;
//     const post = await prisma.commentModel.findUniquet({
//       where: {
//         id: commentID,
//       },
//     });
//     return res.status(HTTP.OK).json({
//       message: "read comment",
//       data: post,
//     });
//   } catch (error) {
//     return res.status(HTTP.BAD).json({
//       message: "unable to read one comment",
//     });
//   }
// };
// // export const likeComment = async(req : Request , res : Response) => {
// //     try {
// //         const { userID , postID , commentID} = req.params
// //         const user = await prisma.authModel.findUnique({
// //             where : {id : userID}
// //         })
// //         if (user) {
// //            const comment : any = await prisma.commentModel.findUnique({
// //             where : { id : commentID}
// //            })
// //            comment?.likes.push(userID)
// //         } else {
// //             return res.status(400).json({
// //                 message : "User Not Found"
// //             })
// //         }
// //         return res.status(200).json({
// //             message : "Liked Comment Successfully"
// //         })
// //     } catch (error) {
// //         return res.status(400).json({
// //             message : "Error Liking Comment",
// //             data : error
// //         })
// //     }
// // }
// // export const unLikeComment = async(req : Request , res : Response) => {
// //     try {
// //         const { userID , postID , commentID} = req.params
// //         const user = await prisma.authModel.findUnique({
// //             where : {id : userID}
// //         })
// //         if (user) {
// //            const comment : any = await prisma.commentModel.findUnique({
// //             where : { id : commentID}
// //            })
// //            comment?.likes.pull(userID)
// //         } else {
// //             return res.status(400).json({
// //                 message : "User Not Found"
// //             })
// //         }
// //         return res.status(200).json({
// //             message : "unLiked Comment Successfully"
// //         })
// //     } catch (error) {
// //         return res.status(400).json({
// //             message : "Error Unliking Comment",
// //             data : error
// //         })
// //     }
// // }
