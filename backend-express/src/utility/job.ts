import { CronJob } from "cron";

import { JobStatusModel } from "../model/db/job-status";
import { NewspaperName } from "../model/newspaper";
import bdNewsHeadlineScrape from "../scrapper/bd-news-bangla/headlines";
import bdNewsTopStoryScrape from "../scrapper/bd-news-bangla/top-stories";
import prothomAloTopStoryScrape from "../scrapper/prothom-alo/top-stories";
import prothomAloHeadlineScrape from "../scrapper/prothom-alo/headlines";
import dailyStarHeadlineScrape from "../scrapper/daily-star/headlines";
import dailyStarTopStoriesScrape from "../scrapper/daily-star/top-stories";

export const job = new CronJob(
  "0 */1 * * * *",
  () => {
    console.log("Next Job", job.nextDate().utc(true).toDate());
    bdNewsHeadlineScrape();
    bdNewsTopStoryScrape();
    prothomAloTopStoryScrape();
    prothomAloHeadlineScrape();
    dailyStarHeadlineScrape();
    dailyStarTopStoriesScrape();

    JobStatusModel.findOne({ newspaperName: NewspaperName.BD_NEWS_24 })
      .then((curJbSts) => {
        if (!curJbSts) {
          const newJobStatus = new JobStatusModel({
            newspaperName: NewspaperName.BD_NEWS_24,
            nextJobDate: job.nextDate().utc(true).toDate(),
          });
          newJobStatus
            .save()
            .then((status) => {
              console.log("Status saved!", status._id);
            })
            .catch((err) => {
              console.log("Status saving error", err);
            });
        } else {
          JobStatusModel.findByIdAndUpdate(
            { _id: curJbSts._id },
            { nextJobDate: job.nextDate() },
            (err, _) => {
              if (err) {
                console.log("Update Status Failed", err);
              } else {
                console.log("Update Status Successfully");
              }
            }
          );
        }
      })
      .catch((err) => {
        console.log("Error in job status", err);
      });
  },
  null,
  true,
  "Asia/Dhaka"
);

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
