"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("./../utility");
const request_promise_1 = __importDefault(require("request-promise"));
const newspaper_1 = require("../../model/newspaper");
const utility_2 = require("../utility");
const helper_1 = require("./helper");
const BD_NEWS_URL = "https://bangla.bdnews24.com";
const scrape = async () => {
    try {
        console.log("Bd news 24 bangla Headlines Scrapper");
        let $ = await request_promise_1.default(helper_1.options(BD_NEWS_URL));
        const h1 = ".bn-news > ul > li > a";
        if ($(h1)) {
            $(h1).each(async (_, element) => {
                const title = $(element).text().replace(/\s+/g, " ").trim();
                let link = utility_2.getAttrValue($(element), "href");
                if (link && link !== "#" && link !== "") {
                    const newNews = await helper_1.getBdNews24Info(newspaper_1.NewsType.HEADLINES, link, title);
                    if (newNews) {
                        utility_1.saveHeadline(newNews);
                    }
                }
            });
        }
    }
    catch (e) {
        console.log("Error in scrapper [bd-news-24-bangla]", e);
    }
};
exports.default = scrape;
