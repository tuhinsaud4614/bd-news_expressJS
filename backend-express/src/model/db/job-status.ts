import { Schema, model } from "mongoose";

// create Schema
const jobStatus = new Schema({
  newspaperName: {
    type: String,
    required: true,
  },
  nextJobDate: {
    type: Date,
    required: true,
  },
});

export const JobStatusModel = model("job_status", jobStatus);
