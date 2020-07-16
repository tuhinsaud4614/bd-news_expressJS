"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("multer");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const body_parser_1 = require("body-parser");
const compression_1 = __importDefault(require("compression"));
// import { job } from "./utility/job";
const http_error_1 = __importDefault(require("./model/http-error"));
const news_routes_1 = __importDefault(require("./routes/news-routes"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const admin_routes_1 = __importDefault(require("./routes/admin-routes"));
dotenv_1.config();
const app = express_1.default();
app.use(compression_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "/public")));
app.use(body_parser_1.urlencoded({ extended: true }));
app.use(body_parser_1.json());
app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH, DELETE");
    next();
});
app.use("/api/news", news_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
// no route found middleware
app.use((_, __, next) => {
    next(new http_error_1.default("Could not find this route.", 404));
});
// Http error handling middleware
app.use((err, req, res, next) => {
    if (req.file) {
        fs_1.unlink(req.file.path, (err) => {
            console.log("File Error", err);
        });
    }
    if (err instanceof multer_1.MulterError &&
        err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            errors: {
                status: 400,
                message: err.message,
            },
        });
    }
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.code || 500).json({
        errors: {
            status: err.code || 500,
            message: err.message || "An unknown error occurred!",
        },
    });
});
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8000;
mongoose_1.connect(process.env.DB_URI || "mongodb://localhost:27017/bd-news", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
    .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log(`App running on ${host}:${port}`);
        // job.start();
    });
})
    .catch((err) => {
    // job.stop();
    console.log(`Database connection failed & the err is ${err}`);
});
