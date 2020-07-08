"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const cheerio_1 = require("cheerio");
const utility_1 = require("../utility");
const newspaper_1 = require("../../model/newspaper");
const utility_2 = require("../../utility");
// Selector
exports.HEADLINE_ITEM_SELECTOR = "ul.list-border.besides";
exports.TOP_STORY_ITEM_SELECTOR = ".four-25 > h3 > a";
exports.options = (url) => ({
    uri: url,
    gzip: true,
    headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9,bn;q=0.8",
    },
    transform: function (body) {
        return cheerio_1.load(body);
    },
});
exports.getDailyStarInfo = async (newsType, title, link) => {
    var _a, _b;
    try {
        const $ = await request_promise_1.default(exports.options(link));
        const newNews = new newspaper_1.News(newsType, newspaper_1.NewspaperName.THE_DAILY_STAR, title, link, []);
        const img = utility_1.getAttrValue($(".featured-image > img"), "src") ||
            utility_1.getAttrValue($(".media-shortcode > img"), "src");
        if (img) {
            newNews.imageUri = img.replace(/\?itok=(.*)$/gi, "").toString();
        }
        else {
            newNews.imageUri = `${utility_2.STATIC_PATHNAME}/images/newspaper/the-daily-star-icon1.png`;
        }
        newNews.imageCaption = utility_1.onlyTextContent($(".caption"));
        newNews.category = utility_1.onlyTextContent($("div.breadcrumb > span:nth-child(3) > a > span"));
        newNews.publishedBy = utility_1.textContent($(".author-name span"));
        newNews.subTitle = utility_1.onlyTextContent($(".detailed-header > div > h2 > em"));
        const date = (_a = utility_1.onlyTextContent($(".detailed-header > div > div.small-text"))) === null || _a === void 0 ? void 0 : _a.split("/ LAST MODIFIED:");
        if (date && date.length === 2) {
            newNews.publishedDate = date[0].trim();
            newNews.updatedDate = date[1].trim();
        }
        let description = [];
        (_b = $(".field-body.view-mode-full > p")) === null || _b === void 0 ? void 0 : _b.each((_, ele) => {
            const tempDes = utility_1.textContent($(ele));
            if (tempDes !== "")
                description.push(tempDes);
        });
        newNews.description = [...description];
        return newNews;
    }
    catch (e) {
        console.log("Error in scrapper [daily-star] (info)", e);
        return null;
    }
};
