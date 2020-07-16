"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./../../model/db/user");
const http_error_1 = __importDefault(require("../../model/http-error"));
exports.getAllUsers = async (_, res, next) => {
    try {
        const allUsers = await user_1.UserModel.find().select("-password -__v").exec();
        if (allUsers.length === 0) {
            return next(new http_error_1.default("No users found!", 404));
        }
        return res.status(200).json({
            users: allUsers.map((user) => user.toObject({ getters: true })),
        });
    }
    catch (e) {
        console.log("Admin side user fetching error & error is", e);
        return next(new http_error_1.default("Something went wrong!", 500));
    }
};
exports.removeUser = async (req, res, next) => {
    user_1.UserModel.findByIdAndDelete(req.params.userId, (err, user) => {
        if (err) {
            return next(new http_error_1.default("User not deleted!", 400));
        }
        if (!user) {
            return next(new http_error_1.default("Something went wrong!", 400));
        }
        res.status(200).json({
            message: "User deleted successfully!",
            user: user._id,
        });
    });
};
