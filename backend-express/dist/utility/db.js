"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const job_status_1 = require("../model/db/job-status");
const newspaper_1 = require("../model/newspaper");
const headlines_1 = __importDefault(require("../scrapper/bd-news-bangla/headlines"));
const top_stories_1 = __importDefault(require("../scrapper/bd-news-bangla/top-stories"));
const top_stories_2 = __importDefault(require("../scrapper/prothom-alo/top-stories"));
const headlines_2 = __importDefault(require("../scrapper/prothom-alo/headlines"));
const headlines_3 = __importDefault(require("../scrapper/daily-star/headlines"));
const top_stories_3 = __importDefault(require("../scrapper/daily-star/top-stories"));
exports.job = new cron_1.CronJob("0 */1 * * * *", () => {
    console.log("Next Job", exports.job.nextDate().utc(true).toDate());
    headlines_1.default();
    top_stories_1.default();
    top_stories_2.default();
    headlines_2.default();
    headlines_3.default();
    top_stories_3.default();
    job_status_1.JobStatusModel.findOne({ newspaperName: newspaper_1.NewspaperName.BD_NEWS_24 })
        .then((curJbSts) => {
        if (!curJbSts) {
            const newJobStatus = new job_status_1.JobStatusModel({
                newspaperName: newspaper_1.NewspaperName.BD_NEWS_24,
                nextJobDate: exports.job.nextDate().utc(true).toDate(),
            });
            newJobStatus
                .save()
                .then((status) => {
                console.log("Status saved!", status._id);
            })
                .catch((err) => {
                console.log("Status saving error", err);
            });
        }
        else {
            job_status_1.JobStatusModel.findByIdAndUpdate({ _id: curJbSts._id }, { nextJobDate: exports.job.nextDate() }, (err, _) => {
                if (err) {
                    console.log("Update Status Failed", err);
                }
                else {
                    console.log("Update Status Successfully");
                }
            });
        }
    })
        .catch((err) => {
        console.log("Error in job status", err);
    });
}, null, true, "Asia/Dhaka");
// const dbConnection = async () => {
//   try {
//     await connect(
//       process.env.DB_URI! || "mongodb://localhost:27017/bd-news",
//       // "mongodb://localhost:27017/bd_news_headlines"
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//       }
//     );
//     console.log("Database connected");
//     // console.log("After job instantiation")
//     job.start();
//   } catch (err) {
//     job.stop();
//     console.log(`Database connection failed & the err is ${err}`);
//   }
// };
// export default dbConnection;
