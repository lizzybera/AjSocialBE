"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mainApp_1 = require("./mainApp");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT);
(0, mainApp_1.mainApp)(app);
const server = app.listen(port, () => {
    console.log("connected", port);
});
process.on("uncaughtException", (err) => {
    console.log("server is shutting doen due to uncaughtException");
    console.log(err);
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("server is shutting doen due to unhandledRejection");
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});
