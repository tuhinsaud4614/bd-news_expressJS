import { News } from "../model/newspaper";
import { NewsModel } from "../model/db/news";

export const textContent = (cheerio: Cheerio): string | null => {
  if (cheerio) {
    return cheerio
      .text()
      .replace(/\n|BdST|\t+|\s+/g, " ")
      .trim();
  }
  return null;
};

export const onlyTextContent = (cheerio: Cheerio): string | null => {
  if (cheerio) {
    return cheerio
      .children()
      .remove()
      .end()
      .text()
      .replace(/\n|BdST|\t+|\s+/g, " ")
      .trim();
  }
  return null;
};

export const isEmpty = <T>(value: T): boolean => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const getAttrValue = (
  cheerio: Cheerio,
  attrName: string
): string | null => {
  const ele = cheerio.attr(attrName);
  if (ele) {
    switch (attrName) {
      case "href":
        if (ele !== "#") {
          return ele;
        }
        return null;
      default:
        if (ele.length > 0) {
          return ele;
        }
        return null;
    }
  }
  return null;
};

export const saveTopStory = async (topStory: News) => {
  try {
    const currentTopStory = await NewsModel.findOne({
      title: topStory.title,
      newspaperName: topStory.newspaperName,
    });

    if (!currentTopStory) {
      const resTopStory = await new NewsModel(topStory.topMap).save();
      console.log(resTopStory._id, "News save in top story successfully!");
    }
  } catch (err) {
    console.log("Error to save news in top stories", err);
  }
};

export const saveHeadline = async (headline: News) => {
  try {
    const currentHeadline = await NewsModel.findOne({
      title: headline.title,
      newspaperName: headline.newspaperName,
    });

    if (!currentHeadline) {
      const resHeadline = await new NewsModel(headline.topMap).save();
      console.log(resHeadline._id, "News save in headline save successfully!");
    }
  } catch (err) {
    console.log("Error to save news in headlines", err);
  }
};
