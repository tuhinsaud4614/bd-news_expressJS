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
exports.TOP_STORY_ITEM_SELECTOR = "#widget_51591 > div > div.contents.summery_view.shaded_bg .content_capability_blog.content_type_article";
exports.HEADLINE_ITEM_SELECTOR = "div.listing > .content_capability_blog.content_type_article";
exports.options = (url) => ({
    uri: url,
    gzip: true,
    headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9,bn;q=0.8",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
    },
    transform: function (body) {
        return cheerio_1.load(body);
    },
});
exports.getProthomAloInfo = async (newsType, title, category, publishedBy, link) => {
    try {
        let $ = await request_promise_1.default(exports.options(link));
        const newNews = new newspaper_1.News(newsType, newspaper_1.NewspaperName.PROTHOM_ALO, title, link, []);
        newNews.category = category;
        newNews.publishedBy = publishedBy;
        newNews.subTitle = utility_1.textContent($(".right_title .title"));
        newNews.publishedDate = utility_1.textContent($(".time > span").first());
        newNews.updatedDate = utility_1.textContent($(".time > span").last());
        const jwMedia = $("div.right_part > div.col_in").text();
        let caption = /title="(.+)" alt/g.exec(jwMedia);
        newNews.imageCaption = caption ? caption[1] : null;
        const description = $(jwMedia)
            .text()
            .replace(/\t+/g, "")
            .trim()
            .split("\n");
        newNews.description = description.slice(0, description.indexOf("আরও সংবাদ"));
        const img = /src="(.+).jpg|src="(.+).gif|src="(.+).jpeg|src="(.+).png/gi.exec(jwMedia);
        if (img) {
            newNews.imageUri = img
                ? img[1].replace(/^\/\//g, "https://") +
                    img[0].slice(img[0].lastIndexOf("."))
                : null;
        }
        else {
            newNews.imageUri = `${utility_2.STATIC_PATHNAME}/images/newspaper/prothom-alo-icon1.png`;
        }
        return newNews;
    }
    catch (e) {
        console.log("Error in scrapper [Prothom-Alo] (info)", e);
        return null;
    }
};
