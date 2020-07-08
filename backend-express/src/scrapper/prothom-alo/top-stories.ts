import rp from "request-promise";

import { News, NewsType } from "../../model/newspaper";
import { options, TOP_STORY_ITEM_SELECTOR, getProthomAloInfo } from "./helper";
import { textContent, getAttrValue, saveTopStory } from "../utility";

const PROTHOM_ALO_URI = "https://www.prothomalo.com/home/commented";

const scrape = async () => {
  try {
    console.log("Prothom Alo Top Stories Scrapper");
    let $: CheerioStatic = await rp(options(PROTHOM_ALO_URI));
    $(TOP_STORY_ITEM_SELECTOR)?.each(async (_, ele) => {
      const title = textContent($(ele).find(".title_holder"));
      const link = getAttrValue($(ele).find("a.link_overlay"), "href");

      if (title && link && link !== "#" && link !== "") {
        const publishedBy = textContent($(ele).find(".author"))?.split(",")[0]!;
        const category = textContent($(ele).find(".category"));
        const newNews: News | null = await getProthomAloInfo(
          NewsType.TOP_STORIES,
          title,
          category,
          publishedBy,
          `https://www.prothomalo.com${link}`
        );
        if (newNews) {
          saveTopStory(newNews);
        }
      }
    });
  } catch (e) {
    console.log("Error in scrapper [Prothom-Alo]", e);
  }
};

// scrape();

export default scrape;
