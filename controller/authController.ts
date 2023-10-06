import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import crypto from "crypto";
import { HTTP } from "../Error/mainError";
import { streamUpload } from "../utils/upload";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { resetPassword, verifyAccount } from "../utils/emails";

const prisma = new PrismaClient()

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const token = crypto.randomBytes(32).toString("hex");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await prisma.authModel.create({
      data: {
        name,
        email,
        password: hash,
        token,
      },
    });

    const tokenID = jwt.sign({ id: user?.id }, "secret");
    verifyAccount(user, tokenID).then(()=>{
      console.log("sent");
    })

    return res.status(HTTP.CREATED).json({
      message: "user created Successfully",
      data: user,
      token: tokenID,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error",
      data: error.message,
    });
  }
};

export const allUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.authModel.findMany({});

    return res.status(HTTP.OK).json({
      message: "reading all users",
      data: users,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error reading all users",
      data: error.message,
    });
  }
};

export const oneUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const userID : any = jwt.verify(token, "secret", (err, payload: any)=>{
      if (err) {
        return err
      } else {
        return payload
      }
    })
    const user = await prisma.authModel.findUnique({
      where: { id: userID?.id },
    });

    return res.status(HTTP.OK).json({
      message: "reading one user",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error reading one user",
      data: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    // const { token } = req.params;
    
    // const userID : any = jwt.verify(token, "secret", (err, payload : any)=>{
    //     if (err) {
    //         return err
    //     } else {
    //         return payload
    //     }
    // })
    const user = await prisma.authModel.delete({
      where: { id: userID}
    });

    return res.status(HTTP.OK).json({
      message: "deleting one user",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error deleting one user",
      data: error.message,
    });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { name } = req.body;

    const userID : any = jwt.verify(token, "secret", (err, payload : any)=>{
        if (err) {
            return err
        } else {
            return payload
        }
    })
    const user = await prisma.authModel.update({
      where: { id: userID?.id },
      data: {
        name,
      },
    });

    return res.status(HTTP.CREATED).json({
      message: "updating one user",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error updating one user",
      data: error.message,
    });
  }
};

export const updateUserAvatar = async (req: any, res: Response) => {
  try {
    const { token } = req.params;

    const userID : any = jwt.verify(token, "secret", (err : any, payload : any)=>{
        if (err) {
            return err
        } else {
            return payload
        }
    })

    const { secure_url, public_id }: any = await streamUpload(req);


    const user = await prisma.authModel.update({
      where: { id: userID?.id },
      data: {
        image: secure_url,
        imageID: public_id,
      },
    });

    return res.status(HTTP.CREATED).json({
      message: "updating one user",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error updating one user",
      data: error.message,
    });
  }
};

export const forgotPassword = async (req: any, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { email },
    });

    if (user?.verified && user?.token === "") {
      const token = jwt.sign({ id: user?.id }, "secret");

      const tokenID : string = token
      resetPassword(user, tokenID)

      const verify = await prisma.authModel.update({
        where: { id: user?.id },
        data: {
          token,
        },
      });

      return res.status(HTTP.CREATED).json({
        message: "you can now change password",
        data: verify,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "please verify first",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error trying to change password",
      data: error.message,
    });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const userID: any = jwt.verify(
      token,
      "secret",
      (err: any, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      }
    );

    const user = await prisma.authModel.findUnique({
      where: { id: userID?.id },
    });

    if (user?.verified && user?.token !== "") {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const change = await prisma.authModel.update({
        where: { id: userID?.id },
        data: {
          token: "",
          password: hash,
        },
      });

      return res.status(HTTP.CREATED).json({
        message: "changing password",
        data: change,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "Please go and verify",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error changing password",
      data: error.message,
    });
  }
};

export const verifyuser = async (req: any, res: Response) => {
  try {
    const { token } = req.params;

    const userID: any = jwt.verify(
      token,
      "secret",
      (err: any, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      }
    );

    const user = await prisma.authModel.update({
      where: { id: userID?.id },
      data: {
        token: "",
        verified: true,
      },
    });

    return res.status(HTTP.CREATED).json({
      message: "verifying user",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error verifying user",
      data: error.message,
    });
  }
};

export const signIn = async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { email },
    });

    if (user) {
      const pass = await bcrypt.compare(password, user?.password!);

      if (pass) {
        if (user?.verified && user?.token === "") {
          const token = jwt.sign({ id: user.id }, "secret");

          return res.status(HTTP.CREATED).json({
            message: `welcome ${user?.name}`,
            data: user?.id,
            token,
          });
        } else {
          return res.status(HTTP.BAD).json({
            message: "please go and verify",
          });
        }
      } else {
        return res.status(HTTP.BAD).json({
          message: "please check password",
        });
      }
    } else {
      return res.status(HTTP.BAD).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error verifying user",
      data: error.message,
    });
  }
};
