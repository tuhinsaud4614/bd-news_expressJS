import path from "path";
import { config } from "dotenv";
import express, {Request, Response, NextFunction} from "express";
import { connect } from "mongoose";
import { json, urlencoded } from "body-parser";

// import { job } from "./utility/job";
import newsRoutes from "./routes/news-routes";
import userRoutes from "./routes/user-routes";
import HttpError from "./model/http-error";

config();

const app = express();

app.use("/", express.static(path.join(__dirname, "..", "public")));
app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api/news", newsRoutes);
app.use("/api/user", userRoutes);

// no route found middleware
app.use((_: Request, __: Response, next: NextFunction) => {
  next(new HttpError("Could not find this route.", 404));
});

// error handling middleware
app.use((err: HttpError, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500).json({
    message: err.message || "An unknown error occurred!",
  });
});

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8000;

connect(process.env.DB_URI! || "mongodb://localhost:27017/bd-news", {
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
