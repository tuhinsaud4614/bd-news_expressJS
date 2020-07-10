"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const validator_1 = __importDefault(require("validator"));
const user_1 = require("../../model/db/user");
const http_error_1 = __importDefault(require("../../model/http-error"));
exports.createUser = async (req, res, next) => {
    let { name, email, password } = req.body;
    name = name.replace(/\s+/, " ").trim();
    email = email.trim();
    password = password.trim();
    if (validator_1.default.isEmpty(name) ||
        validator_1.default.isEmpty(email) ||
        validator_1.default.isEmpty(password)) {
        return next(new http_error_1.default("Field can't be empty!", 422));
    }
    if (!/^[A-Za-z\s]+$/g.test(name)) {
        return next(new http_error_1.default("Invalid name (Only required [a-z])!", 422));
    }
    if (!validator_1.default.isLength(name, { min: 3, max: 20 })) {
        return next(new http_error_1.default("Invalid name (Length should 3-20)!", 422));
    }
    if (!validator_1.default.isEmail(email)) {
        return next(new http_error_1.default("Invalid email!", 422));
    }
    if (/\s+/g.test(password)) {
        return next(new http_error_1.default("Password shouldn't contain space!", 422));
    }
    if (!validator_1.default.isLength(password, { min: 6 })) {
        return next(new http_error_1.default("Password is too short! (At least 6 character)", 422));
    }
    try {
        const currentUser = await user_1.UserModel.findOne({ email: email });
        if (!currentUser) {
            const hashPassword = await bcryptjs_1.hash(password, 12);
            const resUser = await new user_1.UserModel({
                name: name.trim(),
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
            return next(new http_error_1.default("User already exists!", 422));
        }
    }
    catch (error) {
        console.log("Create user error & error is", error);
        return next(new http_error_1.default("User creation failed!", 400));
    }
};
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
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
