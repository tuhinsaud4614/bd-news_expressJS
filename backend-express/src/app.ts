import { MulterError } from "multer";
import path from "path";
import { unlink } from "fs";
import { config } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { connect } from "mongoose";
import { json, urlencoded } from "body-parser";

// import { job } from "./utility/job";
import newsRoutes from "./routes/news-routes";
import userRoutes from "./routes/user-routes";
import HttpError from "./model/http-error";

config();

const app = express();
app.use(express.static(path.join(__dirname, "..", "/public")));

app.use(urlencoded({ extended: true }));
app.use(json());

app.use((_: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH, DELETE");
  next();
});

app.use("/api/news", newsRoutes);
app.use("/api/user", userRoutes);

// no route found middleware
app.use((_: Request, __: Response, next: NextFunction) => {
  next(new HttpError("Could not find this route.", 404));
});

// Http error handling middleware
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    unlink(req.file.path, (err) => {
      console.log("File Error", err);
    });
  }

  if (
    err instanceof MulterError &&
    (<MulterError>err).code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(400).json({
      errors: {
        status: 400,
        message: (<MulterError>err).message,
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

connect(process.env.DB_URI || "mongodb://localhost:27017/bd-news", {
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
