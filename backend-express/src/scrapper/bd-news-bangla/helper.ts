import { NewsType } from "./../../model/newspaper";
import rp from "request-promise";
import { load } from "cheerio";
import { STATIC_PATHNAME } from "../../utility";
import { News, NewspaperName } from "../../model/newspaper";
import { onlyTextContent, getAttrValue } from "../utility";

export const options = (url: string) => ({
  uri: url,
  gzip: true,
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate",
    "accept-language": "en-US,en;q=0.9,bn;q=0.8",
  },
  transform: function (body: string) {
    return load(body);
  },
});

export const getBdNews24Info = async (
  newsType: NewsType,
  link: string,
  title: string
): Promise<News | null> => {
  try {
    const $: CheerioStatic = await rp(options(link));
    const newNews: News = new News(
      newsType,
      NewspaperName.BD_NEWS_24,
      title,
      link,
      []
    );
    newNews.category = onlyTextContent($(".navigation > a").last());
    newNews.publishedBy = onlyTextContent($(".byline"));
    newNews.subTitle = onlyTextContent($(".article_lead_text > h5"));
    // let imageUri: string | undefined;
    $(".dateline > span")?.each((index: number, element: CheerioElement) => {
      if (index === 1) {
        newNews.publishedDate = onlyTextContent($(element));
      }
      if (index === 3) {
        newNews.updatedDate = onlyTextContent($(element));
      }
    });

    const tempImg = getAttrValue($(".media > img"), "src");
    if (tempImg) {
      newNews.imageUri = tempImg;
      newNews.imageCaption = onlyTextContent(
        $(".gallery-image-box.print-only > .caption")
      );
    } else {
      newNews.imageUri = `${STATIC_PATHNAME}/images/newspaper/bdnews24-bangla-icon2.png`;
    }

    let description: string[] = [];
    $(".article_body > .custombody > p")?.each((_, ele: CheerioElement) => {
      const tempDes = onlyTextContent($(ele))!;
      if (tempDes !== "") description.push(tempDes);
    });
    newNews.description = [...description];

    return newNews;
  } catch (e) {
    console.log("Error in scrapper [bd-news-bangla] (info)", e);
    return null;
  }
};
