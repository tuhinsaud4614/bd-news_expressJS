import rp from "request-promise";

import { options, TOP_STORY_ITEM_SELECTOR, getDailyStarInfo } from "./helper";
import { getAttrValue, onlyTextContent, saveTopStory } from "../utility";
import { News, NewsType } from "../../model/newspaper";

const DAILY_STAR_URI = "https://www.thedailystar.net/top-news";

const scrape = async () => {
  try {
    console.log("The daily star top-stories scrapper");
    let $: CheerioStatic = await rp(options(DAILY_STAR_URI));

    $(TOP_STORY_ITEM_SELECTOR)?.each(async (_, ele) => {
      const title = onlyTextContent($(ele));
      const link = getAttrValue($(ele), "href");

      if (link && link !== "#" && link !== "" && title) {
        const newNews: News | null = await getDailyStarInfo(
          NewsType.TOP_STORIES,
          title,
          `https://www.thedailystar.net${link}`
        );
        if (newNews) {
          saveTopStory(newNews);
        }
      }
    });

    // saveHeadline(newNews, NewspaperName.PROTHOM_ALO);
  } catch (e) {
    console.log("Error in scrapper [daily-star]", e);
  }
};

// scrape();

export default scrape;
