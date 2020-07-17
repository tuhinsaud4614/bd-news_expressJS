"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_controllers_1 = require("./../controllers/admin/comment-controllers");
const users_controllers_1 = require("./../controllers/admin/users-controllers");
const is_auth_1 = require("./../middleware/is-auth");
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/admin/auth-controllers");
const users_controllers_2 = require("../controllers/admin/users-controllers");
const news_controllers_1 = require("../controllers/admin/news-controllers");
const router = express_1.Router();
// POST /api/admin/login
router.post("/login", auth_controllers_1.login);
// GET /api/admin/users
router.get("/users", is_auth_1.isAdminAuth, users_controllers_2.getAllUsers);
// DELETE /api/admin/user:userId
router.delete("/users/:userId", is_auth_1.isAdminAuth, users_controllers_1.removeUser);
// GET /api/admin/newsies
router.get("/newsies", news_controllers_1.getAllNews);
// DELETE /api/admin/news:userId
router.delete("/newsies/:newsId", is_auth_1.isAdminAuth, news_controllers_1.removeNews);
// GET /api/admin/comments
router.get("/comments", comment_controllers_1.getAllComments);
// DELETE /api/admin/news:userId
router.delete("/comments/:commentId", is_auth_1.isAdminAuth, comment_controllers_1.removeComment);
exports.default = router;
