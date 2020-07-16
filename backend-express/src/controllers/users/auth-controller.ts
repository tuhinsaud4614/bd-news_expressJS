import { RequestHandler } from "express";
import { hash, compare } from "bcryptjs";
import { sign as jwtSign } from "jsonwebtoken";
import validator from "validator";
import { createTransport } from "nodemailer";

import { UserModel } from "../../model/db/user";
import HttpError from "../../model/http-error";

// mail sender protocol
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "choykuri.python3@gmail.com",
    pass: "t01738518953",
  },
});

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
    return next(
      new HttpError("Password is too short! (At least 6 character)", 422)
    );
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
    console.log("User login error & error is", error);
    return next(new HttpError("User login failed!", 401));
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  let { email } = req.body as {
    email: string;
  };
  email = email.trim();

  if (validator.isEmpty(email)) {
    return next(new HttpError("Field can't be empty!", 422));
  }

  if (!validator.isEmail(email)) {
    return next(new HttpError("Invalid email!", 422));
  }

  try {
    const user = await UserModel.findOne({ email: email }).exec();
    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    const resetToken = Math.floor(Math.random() * 999999);
    const resetTokenExp = new Date(Date.now() + 3600000);
    const resetTokenExpLocal = resetTokenExp.toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    });

    const hasToken = await hash(resetToken.toString(), 12);
    user.resetToken = hasToken;
    user.resetTokenExp = resetTokenExp;

    const mailOptions = {
      from: "BD News <choykuri.python3@gmail.com>",
      to: email,
      subject: "Reset Password Confirmation",
      html: `
        <h4>BD News portal (Password Reset Pin)</h4>
        <p> Your reset pin is ${resetToken}.</p> 
        <p> Your reset pin will expire ${resetTokenExpLocal} (GMT +6).</p> 
      `,
    };

    transporter.sendMail(mailOptions, async (err, _) => {
      if (err) {
        console.log("Reset password error & error is", err);
        return next(new HttpError("Reset password pin sending error!", 500));
      } else {
        try {
          const { _id } = await user.save();

          return res.status(201).json({
            message: "Reset password pin sent successfully!",
            userId: _id,
          });
        } catch (e) {
          console.log("Reset password error & error is", err);
          return next(new HttpError("Reset password pin sending error!", 500));
        }
      }
    });
  } catch (err) {
    console.log("Reset password error & error is", err);
    return next(new HttpError("Something went wrong!", 500));
  }
};

export const resetPinConfirmation: RequestHandler<{ userId: string }> = async (
  req,
  res,
  next
) => {
  let { resetPin } = req.body as { resetPin: string };

  resetPin = resetPin.trim();

  if (validator.isEmpty(resetPin)) {
    return next(new HttpError("Field can't be empty!", 422));
  }

  try {
    const user = await UserModel.findOne({ _id: req.params.userId }).exec();

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    if (
      !user.resetToken ||
      !user.resetTokenExp ||
      user.resetTokenExp.getTime() < Date.now()
    )
      return next(new HttpError("Reset pin is expired!", 400));

    const isResetPinMatch = await compare(resetPin, user.resetToken);
    if (!isResetPinMatch) {
      return next(new HttpError("Invalid reset pin!", 400));
    }

    user.resetTokenIsVerified = true;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    const { _id } = await user.save();
    return res.status(201).json({
      message: "Email is verified!",
      userId: _id,
    });
  } catch (err) {
    console.log("Reset pin confirmation error & error is", err);
    return next(new HttpError("Something went wrong!", 500));
  }
};

export const resetNewPassword: RequestHandler<{ userId: string }> = async (
  req,
  res,
  next
) => {
  let { newPassword } = req.body as { newPassword: string };
  newPassword = newPassword.trim();
  if (validator.isEmpty(newPassword)) {
    return next(new HttpError("Field can't be empty!", 422));
  }

  try {
    const user = await UserModel.findOne({ _id: req.params.userId }).exec();

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    if (!user.resetTokenIsVerified) {
      return next(new HttpError("Email not verified!", 400));
    }

    try {
      const hashPassword = await hash(newPassword, 12);
      user.password = hashPassword;
      user.resetTokenIsVerified = undefined;
      const { _id } = await user.save();

      return res.status(201).json({
        message: "Password update successfully!",
        userId: _id,
      });
    } catch (e) {
      console.log("New password error & error is", e);
      return next(new HttpError("Password update failed!", 400));
    }
  } catch (err) {
    console.log("New password error & error is", err);
    return next(new HttpError("Something went wrong!", 500));
  }
};

export const updateName: RequestHandler = (req, res, next) => {
  let { name } = req.body as { name: string };
  name = name.trim();

  if (validator.isEmpty(name)) {
    res.status(200).json({
      message: "Name remain same!",
    });
  } else if (!/^[A-Za-z\s.]+$/g.test(name)) {
    next(new HttpError("Invalid name (Only required [a-z])!", 422));
  } else {
    UserModel.findOneAndUpdate(
      { _id: req.userId },
      { name: name },
      (err, updatedUser) => {
        if (err) {
          return next(new HttpError("User name not updated!", 400));
        }

        if (!updatedUser) {
          return next(new HttpError("User not exists!", 404));
        }

        res.status(201).json({
          message: "User name updated successfully!",
        });
      }
    );
  }
};

export const updateAvatar: RequestHandler = (req, res, next) => {
  UserModel.findOneAndUpdate(
    { _id: req.userId },
    { avatar: `images/users/${req.file.filename}` },
    (err, updatedUser) => {
      if (err) {
        return next(new HttpError("User Avatar not updated!", 400));
      }
      if (!updatedUser) {
        return next(new HttpError("User not exists!", 404));
      }
      res.json({
        message: "User Avatar updated successfully!",
        updateComment: updatedUser._id,
      });
    }
  );
};

export const updateAddress: RequestHandler = (req, res, next) => {
  let { address } = req.body as { address: string };
  address = address.trim();

  if (validator.isEmpty(address)) {
    res.status(200).json({
      message: "Address remain same!",
    });
  } else {
    UserModel.findOneAndUpdate(
      { _id: req.userId },
      { address: address },
      (err, updatedUser) => {
        if (err) {
          return next(new HttpError("User address not updated!", 400));
        }

        if (!updatedUser) {
          return next(new HttpError("User not exists!", 404));
        }

        res.status(201).json({
          message: "User address updated successfully!",
        });
      }
    );
  }
};
