import { NextFunction, Request, Response } from "express"
import Joi from "joi"

export default (Schema : Joi.ObjectSchema<any>) =>{
    return(req : Request, res : Response, next : NextFunction) =>{
        const {error} = Schema.validate(req.body)

        if(error === undefined || typeof error === "undefined"){
            next()
        }else{
            return res.status(404).json({
                message : "Error validating",
                data : error
            })
        }
    }
}