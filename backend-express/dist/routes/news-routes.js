"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const news_controllers_1 = require("../controllers/news-controllers");
const router = express_1.Router();
router.get("/headlines", news_controllers_1.allHeadlines);
router.get("/top-stories", news_controllers_1.allTopStories);
exports.default = router;
