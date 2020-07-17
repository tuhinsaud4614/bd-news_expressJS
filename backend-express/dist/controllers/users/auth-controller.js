"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const nodemailer_1 = require("nodemailer");
const validator_1 = __importDefault(require("validator"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const user_1 = require("../../model/db/user");
const http_error_1 = __importDefault(require("../../model/http-error"));
// mail sender protocol
const transporter = nodemailer_1.createTransport({
    service: "gmail",
    auth: {
        user: "choykuri.python3@gmail.com",
        pass: "t01738518953",
    },
});
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
    if (!sanitize_html_1.default(name) || !sanitize_html_1.default(email) || !sanitize_html_1.default(password)) {
        return next(new http_error_1.default("Some malicious or invalid inputs found!", 422));
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
                    avatar: currentUser.avatar,
                    address: currentUser.address,
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
        console.log("User login error & error is", error);
        return next(new http_error_1.default("User login failed!", 401));
    }
};
exports.resetPassword = async (req, res, next) => {
    let { email } = req.body;
    email = email.trim();
    if (validator_1.default.isEmpty(email)) {
        return next(new http_error_1.default("Field can't be empty!", 422));
    }
    if (!validator_1.default.isEmail(email)) {
        return next(new http_error_1.default("Invalid email!", 422));
    }
    try {
        const user = await user_1.UserModel.findOne({ email: email }).exec();
        if (!user) {
            return next(new http_error_1.default("User not found!", 404));
        }
        const resetToken = Math.floor(Math.random() * 999999);
        const resetTokenExp = new Date(Date.now() + 3600000);
        const resetTokenExpLocal = resetTokenExp.toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
        });
        const hasToken = await bcryptjs_1.hash(resetToken.toString(), 12);
        user.resetToken = hasToken;
        user.resetTokenExp = resetTokenExp;
        const mailOptions = {
            from: "BD News <choykuri.python3@gmail.com>",
            to: email,
            subject: "Reset Password Confirmation",
            html: `
        <h4>BD News portal (Password Reset Pin)</h4>
        <p> Your reset pin is ${resetToken}.</p> 
        <p> Your reset pin will expire ${resetTokenExpLocal} (GMT +6).</p> 
      `,
        };
        transporter.sendMail(mailOptions, async (err, _) => {
            if (err) {
                console.log("Reset password error & error is", err);
                return next(new http_error_1.default("Reset password pin sending error!", 500));
            }
            else {
                try {
                    const { _id } = await user.save();
                    return res.status(201).json({
                        message: "Reset password pin sent successfully!",
                        userId: _id,
                    });
                }
                catch (e) {
                    console.log("Reset password error & error is", err);
                    return next(new http_error_1.default("Reset password pin sending error!", 500));
                }
            }
        });
    }
    catch (err) {
        console.log("Reset password error & error is", err);
        return next(new http_error_1.default("Something went wrong!", 500));
    }
};
exports.resetPinConfirmation = async (req, res, next) => {
    let { resetPin } = req.body;
    resetPin = resetPin.trim();
    if (validator_1.default.isEmpty(resetPin)) {
        return next(new http_error_1.default("Field can't be empty!", 422));
    }
    try {
        const user = await user_1.UserModel.findOne({ _id: req.params.userId }).exec();
        if (!user) {
            return next(new http_error_1.default("User not found!", 404));
        }
        if (!user.resetToken ||
            !user.resetTokenExp ||
            user.resetTokenExp.getTime() < Date.now())
            return next(new http_error_1.default("Reset pin is expired!", 400));
        const isResetPinMatch = await bcryptjs_1.compare(resetPin, user.resetToken);
        if (!isResetPinMatch) {
            return next(new http_error_1.default("Invalid reset pin!", 400));
        }
        user.resetTokenIsVerified = true;
        user.resetToken = undefined;
        user.resetTokenExp = undefined;
        const { _id } = await user.save();
        return res.status(201).json({
            message: "Email is verified!",
            userId: _id,
        });
    }
    catch (err) {
        console.log("Reset pin confirmation error & error is", err);
        return next(new http_error_1.default("Something went wrong!", 500));
    }
};
exports.resetNewPassword = async (req, res, next) => {
    let { newPassword } = req.body;
    newPassword = newPassword.trim();
    if (validator_1.default.isEmpty(newPassword)) {
        return next(new http_error_1.default("Field can't be empty!", 422));
    }
    if (!sanitize_html_1.default(newPassword)) {
        return next(new http_error_1.default("Some malicious or invalid inputs found!", 422));
    }
    try {
        const user = await user_1.UserModel.findOne({ _id: req.params.userId }).exec();
        if (!user) {
            return next(new http_error_1.default("User not found!", 404));
        }
        if (!user.resetTokenIsVerified) {
            return next(new http_error_1.default("Email not verified!", 400));
        }
        try {
            const hashPassword = await bcryptjs_1.hash(newPassword, 12);
            user.password = hashPassword;
            user.resetTokenIsVerified = undefined;
            const { _id } = await user.save();
            return res.status(201).json({
                message: "Password update successfully!",
                userId: _id,
            });
        }
        catch (e) {
            console.log("New password error & error is", e);
            return next(new http_error_1.default("Password update failed!", 400));
        }
    }
    catch (err) {
        console.log("New password error & error is", err);
        return next(new http_error_1.default("Something went wrong!", 500));
    }
};
exports.updateName = (req, res, next) => {
    let { name } = req.body;
    name = name.trim();
    if (validator_1.default.isEmpty(name)) {
        res.status(200).json({
            message: "Name remain same!",
        });
    }
    else if (!sanitize_html_1.default(name)) {
        next(new http_error_1.default("Some malicious or invalid inputs found!", 422));
    }
    else if (!/^[A-Za-z\s.]+$/g.test(name)) {
        next(new http_error_1.default("Invalid name (Only required [a-z])!", 422));
    }
    else {
        user_1.UserModel.findOneAndUpdate({ _id: req.userId }, { name: name }, (err, updatedUser) => {
            if (err) {
                return next(new http_error_1.default("User name not updated!", 400));
            }
            if (!updatedUser) {
                return next(new http_error_1.default("User not exists!", 404));
            }
            res.status(201).json({
                message: "User name updated successfully!",
                updatedName: updatedUser.name,
            });
        });
    }
};
exports.updateAvatar = (req, res, next) => {
    user_1.UserModel.findOneAndUpdate({ _id: req.userId }, { avatar: `images/users/${req.file.filename}` }, (err, updatedUser) => {
        if (err) {
            return next(new http_error_1.default("User Avatar not updated!", 400));
        }
        if (!updatedUser) {
            return next(new http_error_1.default("User not exists!", 404));
        }
        res.json({
            message: "User Avatar updated successfully!",
            id: updatedUser._id,
            updatedAvatar: updatedUser.avatar,
        });
    });
};
exports.updateAddress = (req, res, next) => {
    let { address } = req.body;
    address = address.trim();
    if (validator_1.default.isEmpty(address)) {
        res.status(200).json({
            message: "Address remain same!",
        });
    }
    else if (!sanitize_html_1.default(address)) {
        next(new http_error_1.default("Some malicious or invalid inputs found!", 422));
    }
    else {
        user_1.UserModel.findOneAndUpdate({ _id: req.userId }, { address: address }, (err, updatedUser) => {
            if (err) {
                return next(new http_error_1.default("User address not updated!", 400));
            }
            if (!updatedUser) {
                return next(new http_error_1.default("User not exists!", 404));
            }
            res.status(201).json({
                message: "User address updated successfully!",
                updatedAddress: updatedUser.address
            });
        });
    }
};
