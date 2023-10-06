import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { errHandler } from "./Error/errorHandler";
import { HTTP, mainError } from "./Error/mainError";
import auth from "./router/authRouter"
import post from "./router/postRouter"
import morgan from "morgan";
import helmet from "helmet";

export const mainApp = (app: Application) => {
  app.use(
    cors({
      origin: "*",
      methods: ["POST", "GET", "PATCH", "DELETE"],
    })
  );
  app.use(express.json());

  app.use(morgan("dev"))
  app.use(helmet())

  app.set("view engine", "ejs")
  
  app.use("/api", auth)
  app.use("/api", post)

  app.get("/", (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            message: 'welcome'
          });
    } catch (error) {
      return res.status(404).json({
        message: Error,
        data: error,
      });
    }
  });

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(
      new mainError({
        name: "Router",
        message: `problem due to incorrect router ${req.originalUrl}`,
        status: HTTP.BAD,
        success: false,
      })
    );
  });

  app.use(errHandler);
};
