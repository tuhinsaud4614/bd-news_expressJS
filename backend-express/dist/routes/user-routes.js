"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_upload_1 = require("./../middleware/image-upload");
const is_auth_1 = require("./../middleware/is-auth");
const auth_controller_1 = require("../controllers/users/auth-controller");
const comment_controller_1 = require("../controllers/users/comment-controller");
const router = express_1.Router();
router.post("/create-user", auth_controller_1.createUser);
router.post("/login", auth_controller_1.login);
router.patch("/update-avatar", is_auth_1.isAuth, image_upload_1.imageUpload("public/images/users/").single("avatar"), auth_controller_1.updateAvatar);
// Get all comments for specific news
router.get("/comments/:newsId", comment_controller_1.allComments);
router.post("/comment", is_auth_1.isAuth, comment_controller_1.createComment);
router.patch("/comment/:id", is_auth_1.isAuth, comment_controller_1.editComment);
router.delete("/comment/:id", is_auth_1.isAuth, comment_controller_1.deleteComment);
exports.default = router;
