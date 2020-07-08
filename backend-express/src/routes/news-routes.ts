import { Router } from "express";
import {
  allHeadlines,
  allTopStories,
} from "../controllers/news-controllers";

const router = Router();

router.get("/headlines", allHeadlines);
router.get("/top-stories", allTopStories);

export default router;
