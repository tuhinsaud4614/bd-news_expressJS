import { isAuth } from "./../middleware/is-auth";
import { Router } from "express";
import {
  createUser,
  createComment,
  login,
  editComment,
  deleteComment,
} from "../controllers/user-controller";

const router = Router();

router.post("/create-user", createUser);
router.post("/login", login);
router.post("/comment", isAuth, createComment);
router.patch("/comment/:id", isAuth, editComment);
router.delete("/comment/:id", isAuth, deleteComment);

export default router;
