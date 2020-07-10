import { RequestHandler } from "express";
import { hash, compare } from "bcryptjs";
import { sign as jwtSign } from "jsonwebtoken";
import validator from "validator";

import { UserModel } from "../../model/db/user";
import HttpError from "../../model/http-error";

export const createUser: RequestHandler = async (req, res, next) => {
  let { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  name = name.replace(/\s+/, " ").trim();
  email = email.trim();
  password = password.trim();

  if (
    validator.isEmpty(name) ||
    validator.isEmpty(email) ||
    validator.isEmpty(password)
  ) {
    return next(new HttpError("Field can't be empty!", 422));
  }

  if (!/^[A-Za-z\s]+$/g.test(name)) {
    return next(new HttpError("Invalid name (Only required [a-z])!", 422));
  }

  if (!validator.isLength(name, { min: 3, max: 20 })) {
    return next(new HttpError("Invalid name (Length should 3-20)!", 422));
  }

  if (!validator.isEmail(email)) {
    return next(new HttpError("Invalid email!", 422));
  }

  if (/\s+/g.test(password)) {
    return next(new HttpError("Password shouldn't contain space!", 422));
  }

  if (!validator.isLength(password, { min: 6 })) {
    return next(new HttpError("Password is too short! (At least 6 character)", 422));
  }

  try {
    const currentUser = await UserModel.findOne({ email: email });
    if (!currentUser) {
      const hashPassword = await hash(password, 12);
      const resUser = await new UserModel({
        name: name.trim(),
        email: email,
        password: hashPassword,
        avatar: null,
        address: null,
      }).save();

      res.status(201).json({
        message: "User created successfully!",
        user: resUser.name,
      });
    } else {
      return next(new HttpError("User already exists!", 422));
    }
  } catch (error) {
    console.log("Create user error & error is", error);
    return next(new HttpError("User creation failed!", 400));
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };
  try {
    const currentUser = await UserModel.findOne({ email: email });
    if (currentUser) {
      const isMatch = await compare(password, currentUser.password);
      if (!isMatch) {
        return next(new HttpError("Wrong User credentials!", 422));
      } else {
        const token = jwtSign(
          {
            name: currentUser.name,
            email: currentUser.email,
            id: currentUser._id,
          },
          process.env.SECRET_OR_KEY || "supersecret",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          userId: currentUser._id,
        });
      }
    } else {
      return next(new HttpError("User Not Found!", 404));
    }
  } catch (error) {
    console.log("Create user error & error is", error);
    return next(new HttpError("User creation failed!", 401));
  }
};

export const updateAvatar: RequestHandler = async (req, res, next) => {
  UserModel.findOneAndUpdate(
    { _id: req.userId },
    { avatar: `images/users/${req.file.filename}` },
    (err, updatedUser) => {
      if (err) {
        return next(new HttpError("User Avatar not updated!", 400));
      }
      if (!updatedUser) {
        return next(new HttpError("Comment not exists!", 404));
      }
      res.json({
        message: "User Avatar updated successfully!",
        updateComment: updatedUser._id,
      });
    }
  );
};
