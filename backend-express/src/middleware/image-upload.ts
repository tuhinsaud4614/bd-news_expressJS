import multer from "multer";
import { v1 as uuid } from "uuid";
import { mkdirSync } from "fs";

const MIME_TYPE: { [key: string]: string } = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

const MAX_FILE_SIZE = 10000000;

export const imageUpload = (fieldPath: string) => {
  return multer({
    limits: { fileSize: MAX_FILE_SIZE },
    storage: multer.diskStorage({
      destination(_, __, cb) {
        mkdirSync(fieldPath, { recursive: true });
        cb(null, fieldPath);
      },
      filename(req, file, cb) {
        const ext = MIME_TYPE[file.mimetype];
        const imageName = `${uuid()}${
          !!req.userId ? "_" + req.userId : ""
        }.${ext}`;
        cb(null, imageName);
      },
    }),
    fileFilter(_, file, cb) {
      const isValid = !!MIME_TYPE[file.mimetype];
      let error: Error | null;

      error = isValid ? null : new Error("Invalid Input Type.");
      if (error !== null) {
        cb(error);
      } else {
        cb(null, true);
      }
    },
  });
};
