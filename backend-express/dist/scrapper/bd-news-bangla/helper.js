"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const cheerio_1 = require("cheerio");
const utility_1 = require("../../utility");
const newspaper_1 = require("../../model/newspaper");
const utility_2 = require("../utility");
exports.options = (url) => ({
    uri: url,
    gzip: true,
    headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.9,bn;q=0.8",
    },
    transform: function (body) {
        return cheerio_1.load(body);
    },
});
exports.getBdNews24Info = async (newsType, link, title) => {
    var _a, _b;
    try {
        const $ = await request_promise_1.default(exports.options(link));
        const newNews = new newspaper_1.News(newsType, newspaper_1.NewspaperName.BD_NEWS_24, title, link, []);
        newNews.category = utility_2.onlyTextContent($(".navigation > a").last());
        newNews.publishedBy = utility_2.onlyTextContent($(".byline"));
        newNews.subTitle = utility_2.onlyTextContent($(".article_lead_text > h5"));
        // let imageUri: string | undefined;
        (_a = $(".dateline > span")) === null || _a === void 0 ? void 0 : _a.each((index, element) => {
            if (index === 1) {
                newNews.publishedDate = utility_2.onlyTextContent($(element));
            }
            if (index === 3) {
                newNews.updatedDate = utility_2.onlyTextContent($(element));
            }
        });
        const tempImg = utility_2.getAttrValue($(".media > img"), "src");
        if (tempImg) {
            newNews.imageUri = tempImg;
            newNews.imageCaption = utility_2.onlyTextContent($(".gallery-image-box.print-only > .caption"));
        }
        else {
            newNews.imageUri = `${utility_1.STATIC_PATHNAME}/images/newspaper/bdnews24-bangla-icon2.png`;
        }
        let description = [];
        (_b = $(".article_body > .custombody > p")) === null || _b === void 0 ? void 0 : _b.each((_, ele) => {
            const tempDes = utility_2.onlyTextContent($(ele));
            if (tempDes !== "")
                description.push(tempDes);
        });
        newNews.description = [...description];
        return newNews;
    }
    catch (e) {
        console.log("Error in scrapper [bd-news-bangla] (info)", e);
        return null;
    }
};
