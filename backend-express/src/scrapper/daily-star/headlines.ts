import rp from "request-promise";

import { options, HEADLINE_ITEM_SELECTOR, getDailyStarInfo } from "./helper";
import { getAttrValue, onlyTextContent, saveHeadline } from "../utility";
import { News, NewsType } from "../../model/newspaper";

const DAILY_STAR_URI = "https://www.thedailystar.net/";

const scrape = async () => {
  try {
    console.log("The daily star headlines scrapper");
    let $: CheerioStatic = await rp(options(DAILY_STAR_URI));
    $(HEADLINE_ITEM_SELECTOR)
      .eq(0)
      .find("li")
      .each(async (_, ele) => {
        const title = onlyTextContent($($(ele).find(".list-content a")));
        const link = getAttrValue($($(ele).find(".list-content a")), "href");
        // console.log(title);

        if (link && link !== "#" && link !== "" && title) {
          const newNews: News | null = await getDailyStarInfo(
            NewsType.HEADLINES,
            title,
            `https://www.thedailystar.net${link}`
          );
          if (newNews) {
            saveHeadline(newNews);
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
