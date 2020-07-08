import { NewsType } from './../../model/newspaper';
import rp from "request-promise";
import { load } from "cheerio";
import { onlyTextContent, getAttrValue, textContent } from "../utility";
import { News, NewspaperName } from "../../model/newspaper";
import { STATIC_PATHNAME } from "../../utility";

// Selector
export const HEADLINE_ITEM_SELECTOR = "ul.list-border.besides";
export const TOP_STORY_ITEM_SELECTOR = ".four-25 > h3 > a";

export const options = (url: string) => ({
  uri: url,
  gzip: true,
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,bn;q=0.8",
  },
  transform: function (body: string) {
    return load(body);
  },
});

export const getDailyStarInfo = async (
  newsType: NewsType,
  title: string,
  link: string
): Promise<News | null> => {
  try {
    const $: CheerioStatic = await rp(options(link));
    const newNews: News = new News(
      newsType,
      NewspaperName.THE_DAILY_STAR,
      title,
      link,
      []
    );
    const img =
      getAttrValue($(".featured-image > img"), "src") ||
      getAttrValue($(".media-shortcode > img"), "src");
    if (img) {
      newNews.imageUri = img.replace(/\?itok=(.*)$/gi, "").toString();
    } else {
      newNews.imageUri = `${STATIC_PATHNAME}/images/newspaper/the-daily-star-icon1.png`;
    }
    newNews.imageCaption = onlyTextContent($(".caption"));
    newNews.category = onlyTextContent(
      $("div.breadcrumb > span:nth-child(3) > a > span")
    );

    newNews.publishedBy = textContent($(".author-name span"));
    newNews.subTitle = onlyTextContent($(".detailed-header > div > h2 > em"));
    const date = onlyTextContent(
      $(".detailed-header > div > div.small-text")
    )?.split("/ LAST MODIFIED:");
    if (date && date.length === 2) {
      newNews.publishedDate = date[0].trim();
      newNews.updatedDate = date[1].trim();
    }

    let description: string[] = [];
    $(".field-body.view-mode-full > p")?.each((_, ele: CheerioElement) => {
      const tempDes = textContent($(ele))!;
      if (tempDes !== "") description.push(tempDes);
    });
    newNews.description = [...description];

    return newNews;
  } catch (e) {
    console.log("Error in scrapper [daily-star] (info)", e);
    return null;
  }
};
