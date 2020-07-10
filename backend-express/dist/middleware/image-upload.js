"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const fs_1 = require("fs");
const MIME_TYPE = {
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
};
const MAX_FILE_SIZE = 10000000;
exports.imageUpload = (fieldPath) => {
    return multer_1.default({
        limits: { fileSize: MAX_FILE_SIZE },
        storage: multer_1.default.diskStorage({
            destination(_, __, cb) {
                fs_1.mkdirSync(fieldPath, { recursive: true });
                cb(null, fieldPath);
            },
            filename(req, file, cb) {
                const ext = MIME_TYPE[file.mimetype];
                const imageName = `${uuid_1.v1()}${!!req.userId ? "_" + req.userId : ""}.${ext}`;
                cb(null, imageName);
            },
        }),
        fileFilter(_, file, cb) {
            const isValid = !!MIME_TYPE[file.mimetype];
            let error;
            error = isValid ? null : new Error("Invalid Input Type.");
            if (error !== null) {
                cb(error);
            }
            else {
                cb(null, true);
            }
        },
    });
};
