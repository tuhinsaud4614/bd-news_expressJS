"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = require("bcryptjs");
const admin_1 = require("../../model/db/admin");
const http_error_1 = __importDefault(require("../../model/http-error"));
exports.login = async (req, res, next) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (validator_1.default.isEmpty(email) || validator_1.default.isEmpty(password)) {
        return next(new http_error_1.default("Field can't be empty!", 422));
    }
    if (!validator_1.default.isEmail(email)) {
        return next(new http_error_1.default("Invalid email!", 422));
    }
    try {
        const currentUser = await admin_1.AdminModel.findOne({ email: email });
        if (currentUser) {
            const isMatch = await bcryptjs_1.compare(password, currentUser.password);
            if (!isMatch) {
                return next(new http_error_1.default("Wrong Admin credentials!", 422));
            }
            else {
                const token = jsonwebtoken_1.sign({
                    email: currentUser.email,
                    id: currentUser._id,
                }, process.env.SECRET_OR_KEY_ADMIN || "supersecretadmin", { expiresIn: "1h" });
                res.status(200).json({
                    token: token,
                    adminId: currentUser._id,
                });
            }
        }
        else {
            return next(new http_error_1.default("Admin Not Found!", 404));
        }
    }
    catch (error) {
        console.log("Admin login error & error is", error);
        return next(new http_error_1.default("Admin login failed!", 401));
    }
};
