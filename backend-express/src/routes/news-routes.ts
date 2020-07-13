import { headlinesByDate } from './../controllers/news-controllers';
import { Router } from "express";
import {
  allHeadlines,
  allTopStories,
  topStoriesByDate,
} from "../controllers/news-controllers";

const router = Router();

router.get("/headlines", allHeadlines);

router.get("/top-stories", allTopStories);

router.post("/top-stories-by-date", topStoriesByDate);

router.post("/headlines-by-date", headlinesByDate);

export default router;
