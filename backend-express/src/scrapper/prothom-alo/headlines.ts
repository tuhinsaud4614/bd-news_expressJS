import rp from "request-promise";

import { News, NewsType } from "../../model/newspaper";
import { options, HEADLINE_ITEM_SELECTOR, getProthomAloInfo } from "./helper";
import { textContent, getAttrValue, saveHeadline } from "../utility";

const PROTHOM_ALO_URI = "https://www.prothomalo.com/archive";

const scrape = async () => {
  try {
    console.log("Prothom Alo Headlines Scrapper");
    let $: CheerioStatic = await rp(options(PROTHOM_ALO_URI));
    $(HEADLINE_ITEM_SELECTOR)?.each(async (_, ele) => {
      const title = textContent($(ele).find(".title_holder > .title"));
      const link = getAttrValue($(ele).find("a.link_overlay"), "href");

      if (title && link && link !== "#" && link !== "") {
        const publishedBy = textContent($(ele).find(".author"))?.split(",")[0]!;
        const category = textContent($(ele).find(".category"));
        const newNews: News | null = await getProthomAloInfo(
          NewsType.HEADLINES,
          title,
          category,
          publishedBy,
          `https://www.prothomalo.com${link}`
        );
        // console.log(newNews);
        if (newNews) {
          saveHeadline(newNews);
        }
      }
    });
  } catch (e) {
    console.log("Error in scrapper [Prothom-Alo]", e);
  }
};

// scrape();

export default scrape;
