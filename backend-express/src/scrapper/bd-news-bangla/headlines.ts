import { saveHeadline } from "./../utility";
import rp from "request-promise";
import { News, NewsType } from "../../model/newspaper";
import { getAttrValue } from "../utility";
import { getBdNews24Info, options } from "./helper";

const BD_NEWS_URL = "https://bangla.bdnews24.com";

const scrape = async () => {
  try {
    console.log("Bd news 24 bangla Headlines Scrapper");
    let $: CheerioStatic = await rp(options(BD_NEWS_URL));
    const h1 = ".bn-news > ul > li > a";
    if ($(h1)) {
      $(h1).each(async (_, element) => {
        const title = $(element).text().replace(/\s+/g, " ").trim();
        let link = getAttrValue($(element), "href");
        if (link && link !== "#" && link !== "") {
          const newNews: News | null = await getBdNews24Info(
            NewsType.HEADLINES,
            link,
            title
          );
          if (newNews) {
            saveHeadline(newNews);
          }
        }
      });
    }
  } catch (e) {
    console.log("Error in scrapper [bd-news-24-bangla]", e);
  }
};

export default scrape;
