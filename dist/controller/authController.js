"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.verifyuser = exports.changePassword = exports.forgotPassword = exports.updateUserAvatar = exports.updateUserInfo = exports.deleteUser = exports.oneUser = exports.allUsers = exports.register = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const mainError_1 = require("../Error/mainError");
const upload_1 = require("../utils/upload");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emails_1 = require("../utils/emails");
const prisma = new client_1.PrismaClient();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const user = yield prisma.authModel.create({
            data: {
                name,
                email,
                password: hash,
                token,
            },
        });
        const tokenID = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id }, "secret");
        (0, emails_1.verifyAccount)(user, tokenID).then(() => {
            console.log("sent");
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "user created Successfully",
            data: user,
            token: tokenID,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error",
            data: error.message,
        });
    }
});
exports.register = register;
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.authModel.findMany({});
        return res.status(mainError_1.HTTP.OK).json({
            message: "reading all users",
            data: users,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error reading all users",
            data: error.message,
        });
    }
});
exports.allUsers = allUsers;
const oneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const userID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authModel.findUnique({
            where: { id: userID === null || userID === void 0 ? void 0 : userID.id },
        });
        return res.status(mainError_1.HTTP.OK).json({
            message: "reading one user",
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error reading one user",
            data: error.message,
        });
    }
});
exports.oneUser = oneUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield prisma.authModel.delete({
            where: { id: userID }
        });
        return res.status(mainError_1.HTTP.OK).json({
            message: "deleting one user",
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error deleting one user",
            data: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { name } = req.body;
        const userID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authModel.update({
            where: { id: userID === null || userID === void 0 ? void 0 : userID.id },
            data: {
                name,
            },
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "updating one user",
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error updating one user",
            data: error.message,
        });
    }
});
exports.updateUserInfo = updateUserInfo;
const updateUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const userID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const { secure_url, public_id } = yield (0, upload_1.streamUpload)(req);
        const user = yield prisma.authModel.update({
            where: { id: userID === null || userID === void 0 ? void 0 : userID.id },
            data: {
                image: secure_url,
                imageID: public_id,
            },
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "updating one user",
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error updating one user",
            data: error.message,
        });
    }
});
exports.updateUserAvatar = updateUserAvatar;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { email },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.token) === "") {
            const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id }, "secret");
            const tokenID = token;
            (0, emails_1.resetPassword)(user, tokenID);
            const verify = yield prisma.authModel.update({
                where: { id: user === null || user === void 0 ? void 0 : user.id },
                data: {
                    token,
                },
            });
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "you can now change password",
                data: verify,
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD).json({
                message: "please verify first",
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error trying to change password",
            data: error.message,
        });
    }
});
exports.forgotPassword = forgotPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const userID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authModel.findUnique({
            where: { id: userID === null || userID === void 0 ? void 0 : userID.id },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.token) !== "") {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(password, salt);
            const change = yield prisma.authModel.update({
                where: { id: userID === null || userID === void 0 ? void 0 : userID.id },
                data: {
                    token: "",
                    password: hash,
                },
            });
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "changing password",
                data: change,
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD).json({
                message: "Please go and verify",
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error changing password",
            data: error.message,
        });
    }
});
exports.changePassword = changePassword;
const verifyuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const userID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authModel.update({
            where: { id: userID === null || userID === void 0 ? void 0 : userID.id },
            data: {
                token: "",
                verified: true,
            },
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "verifying user",
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error verifying user",
            data: error.message,
        });
    }
});
exports.verifyuser = verifyuser;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { email },
        });
        if (user) {
            const pass = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (pass) {
                if ((user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.token) === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
                    return res.status(mainError_1.HTTP.CREATED).json({
                        message: `welcome ${user === null || user === void 0 ? void 0 : user.name}`,
                        data: user === null || user === void 0 ? void 0 : user.id,
                        token,
                    });
                }
                else {
                    return res.status(mainError_1.HTTP.BAD).json({
                        message: "please go and verify",
                    });
                }
            }
            else {
                return res.status(mainError_1.HTTP.BAD).json({
                    message: "please check password",
                });
            }
        }
        else {
            return res.status(mainError_1.HTTP.BAD).json({
                message: "User not found",
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD).json({
            message: "Error verifying user",
            data: error.message,
        });
    }
});
exports.signIn = signIn;
