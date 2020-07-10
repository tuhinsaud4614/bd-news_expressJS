"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.dataFilePath = path_1.join(__dirname, "../..", "data.json");
exports.rootPath = path_1.join(__dirname, "../..");
exports.STATIC_PATHNAME = `${process.env.HOST || "localhost"}:${process.env.PORT || "8000"}`;
