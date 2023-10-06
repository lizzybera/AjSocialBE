"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const multer_1 = __importDefault(require("multer"));
const validateHolder_1 = __importDefault(require("../utils/validateHolder"));
const validate_1 = require("../utils/validate");
const myUpload = (0, multer_1.default)().single("image");
const router = express_1.default.Router();
router.route("/all-users").get(authController_1.allUsers);
router.route("/:token/one-user").get(authController_1.oneUser);
router.route("/register").post((0, validateHolder_1.default)(validate_1.createUser), authController_1.register);
router.route("/sign-in").post(authController_1.signIn);
router.route("/:token/verify").patch(authController_1.verifyuser);
router.route("/forgot-password").patch(authController_1.forgotPassword);
router.route("/:token/change-password").patch(authController_1.changePassword);
router.route("/:token/update-info").patch(authController_1.updateUserInfo);
router.route("/:token/update-avatar").patch(myUpload, authController_1.updateUserAvatar);
router.route("/:userID/delete-user").delete(authController_1.deleteUser);
exports.default = router;
