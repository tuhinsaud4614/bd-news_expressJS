import { RequestHandler } from "express";
import { sign as jwtSign } from "jsonwebtoken";
import validator from "validator";
import { compare } from "bcryptjs";

import { AdminModel } from "../../model/db/admin";
import HttpError from "../../model/http-error";

export const login: RequestHandler = async (req, res, next) => {
  let { email, password } = req.body as {
    email: string;
    password: string;
  };

  email = email.trim();
  password = password.trim();

  if (validator.isEmpty(email) || validator.isEmpty(password)) {
    return next(new HttpError("Field can't be empty!", 422));
  }

  if (!validator.isEmail(email)) {
    return next(new HttpError("Invalid email!", 422));
  }

  try {
    const currentUser = await AdminModel.findOne({ email: email });
    if (currentUser) {
      const isMatch = await compare(password, currentUser.password);
      if (!isMatch) {
        return next(new HttpError("Wrong Admin credentials!", 422));
      } else {
        const token = jwtSign(
          {
            email: currentUser.email,
            id: currentUser._id,
          },
          process.env.SECRET_OR_KEY_ADMIN || "supersecretadmin",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          adminId: currentUser._id,
        });
      }
    } else {
      return next(new HttpError("Admin Not Found!", 404));
    }
  } catch (error) {
    console.log("Admin login error & error is", error);
    return next(new HttpError("Admin login failed!", 401));
  }
};
