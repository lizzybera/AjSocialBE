"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./Error/errorHandler");
const mainError_1 = require("./Error/mainError");
const authRouter_1 = __importDefault(require("./router/authRouter"));
// import post from "./router/postRouter"
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const mainApp = (app) => {
    app.use((0, cors_1.default)({
        origin: "*",
        methods: ["POST", "GET", "PATCH", "DELETE"],
    }));
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)("dev"));
    app.use((0, helmet_1.default)());
    app.set("view engine", "ejs");
    app.use("/api", authRouter_1.default);
    // app.use("/api", post)
    app.get("/", (req, res) => {
        try {
            return res.status(200).json({
                message: 'welcome'
            });
        }
        catch (error) {
            return res.status(404).json({
                message: Error,
                data: error,
            });
        }
    });
    app.all("*", (req, res, next) => {
        next(new mainError_1.mainError({
            name: "Router",
            message: `problem due to incorrect router ${req.originalUrl}`,
            status: mainError_1.HTTP.BAD,
            success: false,
        }));
    });
    app.use(errorHandler_1.errHandler);
};
exports.mainApp = mainApp;
