import { removeUser } from "./../controllers/admin/users-controllers";
import { isAdminAuth } from "./../middleware/is-auth";
import { Router } from "express";

import { login } from "../controllers/admin/auth-controllers";
import { getAllUsers } from "../controllers/admin/users-controllers";
import { getAllNews, removeNews } from "../controllers/admin/news-controllers";

const router = Router();

// POST /api/admin/login
router.post("/login", login);

// GET /api/admin/users
router.get("/users", isAdminAuth, getAllUsers);
// DELETE /api/admin/user:userId
router.delete("/user/:userId", isAdminAuth, removeUser);

// GET /api/admin/newsies
router.get("/newsies", getAllNews);
// DELETE /api/admin/news:userId
router.delete("/news/:newsId", isAdminAuth, removeNews);

export default router;
