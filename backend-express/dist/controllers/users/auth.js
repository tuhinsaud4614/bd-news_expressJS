"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = require("../../model/db/user");
const http_error_1 = __importDefault(require("../../model/http-error"));
exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const currentUser = await user_1.UserModel.findOne({ email: email });
        if (!currentUser) {
            const hashPassword = await bcryptjs_1.hash(password, 12);
            const resUser = await new user_1.UserModel({
                name: name,
                email: email,
                password: hashPassword,
                avatar: null,
                address: null,
            }).save();
            res.status(201).json({
                message: "User created successfully!",
                user: resUser.name,
            });
        }
        else {
            return next(new http_error_1.default("User already exists!", 400));
        }
    }
    catch (error) {
        console.log("Create user error & error is", error);
        return next(new http_error_1.default("User creation failed!", 401));
    }
};
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const currentUser = await user_1.UserModel.findOne({ email: email });
        if (currentUser) {
            const isMatch = await bcryptjs_1.compare(password, currentUser.password);
            if (!isMatch) {
                return next(new http_error_1.default("Wrong User credentials!", 422));
            }
            else {
                const token = jsonwebtoken_1.sign({
                    name: currentUser.name,
                    email: currentUser.email,
                    id: currentUser._id,
                }, process.env.SECRET_OR_KEY || "supersecret", { expiresIn: "1h" });
                res.status(200).json({
                    token: token,
                    userId: currentUser._id,
                });
            }
        }
        else {
            return next(new http_error_1.default("User Not Found!", 404));
        }
    }
    catch (error) {
        console.log("Create user error & error is", error);
        return next(new http_error_1.default("User creation failed!", 401));
    }
};
exports.updateAvatar = async (req, res, next) => {
    user_1.UserModel.findOneAndUpdate({ _id: req.userId }, { avatar: `images/users/${req.file.filename}` }, (err, updatedUser) => {
        if (err) {
            return next(new http_error_1.default("User Avatar not updated!", 400));
        }
        if (!updatedUser) {
            return next(new http_error_1.default("Comment not exists!", 404));
        }
        res.json({
            message: "User Avatar updated successfully!",
            updateComment: updatedUser._id,
        });
    });
};
