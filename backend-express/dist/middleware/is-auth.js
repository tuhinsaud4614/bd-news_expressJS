"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const http_error_1 = __importDefault(require("../model/http-error"));
exports.isAuth = (req, _, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    if (!req.get("Authorization")) {
        return next(new http_error_1.default("Not Authenticated", 401));
    }
    const token = req.get("Authorization").split(" ")[1];
    try {
        let decodedToken = jsonwebtoken_1.verify(token, process.env.SECRET_OR_KEY || "supersecret");
        if (typeof decodedToken === "object") {
            req.userId = decodedToken.id;
            next();
        }
        else {
            return next(new http_error_1.default("Authentication Failed!", 401));
        }
    }
    catch (err) {
        return next(new http_error_1.default("Not Authenticated", 401));
    }
};
