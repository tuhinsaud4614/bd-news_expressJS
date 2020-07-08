import rp from "request-promise";

import { options, getBdNews24Info } from "./helper";
import { News, NewsType } from "../../model/newspaper";
import { getAttrValue, saveTopStory } from "../utility";
// import { TopStoryModel } from "../../model/db/headlines-and-news";

const BD_NEWS_URL = "https://bangla.bdnews24.com";

const scrape = async () => {
  try {
    console.log("Bd news 24 bangla Top Stories Scrapper");
    let $: CheerioStatic = await rp(options(BD_NEWS_URL));
    const s1 = "#other_top_stories_home_css > .article a";
    if ($(s1)) {
      $(s1).each(async (_, element) => {
        const title = $(element).text().replace(/\s+/g, " ").trim();
        let link = getAttrValue($(element), "href");
        // console.log(`index ${_}: title = ${title}, link = ${link}`);
        if (link && link !== "#" && link !== "") {
          const newNews: News | null = await getBdNews24Info(
            NewsType.TOP_STORIES,
            link,
            title
          );
          if (newNews) {
            saveTopStory(newNews);
          }
        }
      });
    }
  } catch (e) {
    console.log("Error in scrapper [bd-news-24-bangla]", e);
  }
};

export default scrape;
