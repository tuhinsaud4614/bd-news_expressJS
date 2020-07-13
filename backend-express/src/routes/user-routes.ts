import {
  resetPassword,
  resetPinConfirmation,
  resetNewPassword,
} from "./../controllers/users/auth-controller";
import { Router } from "express";

import { imageUpload } from "./../middleware/image-upload";
import { isAuth } from "./../middleware/is-auth";
import {
  createUser,
  login,
  updateAvatar,
} from "../controllers/users/auth-controller";
import {
  createComment,
  editComment,
  deleteComment,
  allComments,
} from "../controllers/users/comment-controller";
import { setFavorite, removeFavorite } from "../controllers/users/favorite-controller";

const router = Router();

router.post("/create-user", createUser);

router.post("/login", login);

router.post("/reset-password", resetPassword);

router.post("/reset-pin-confirmation/:userId", resetPinConfirmation);

router.patch("/reset-new-password/:userId", resetNewPassword);

router.patch(
  "/update-avatar",
  [isAuth, imageUpload("public/images/users/").single("avatar")],
  updateAvatar
);

/// Comment Controller
// Get all comments for specific news
router.get("/comments/:newsId", allComments);

router.post("/comment", isAuth, createComment);

router.patch("/comment/:id", isAuth, editComment);

router.delete("/comment/:id", isAuth, deleteComment);


/// Favorite Controller
router.post("/favorite", isAuth, setFavorite);
router.post("/not-favorite", isAuth, removeFavorite);

export default router;
