"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// create Schema
const jobStatus = new mongoose_1.Schema({
    newspaperName: {
        type: String,
        required: true,
    },
    nextJobDate: {
        type: Date,
        required: true,
    },
});
exports.JobStatusModel = mongoose_1.model("job_status", jobStatus);
