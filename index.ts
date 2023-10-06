import express, { Application } from "express"
import dotenv from "dotenv"
import { mainApp } from "./mainApp"
dotenv.config()

const app : Application = express()
const port : number = parseInt(process.env.PORT!)

mainApp(app)

const server = app.listen(port, ()=>{
    console.log("connected", port);
    
})

process.on("uncaughtException", (err : any)=>{
    console.log("server is shutting doen due to uncaughtException");
    console.log(err);
    
    process.exit(1)
})

process.on("unhandledRejection", (err : any)=>{
    console.log("server is shutting doen due to unhandledRejection");
    console.log(err);
    
    server.close(()=>{
        process.exit(1)
    })
})
