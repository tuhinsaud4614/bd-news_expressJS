"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const helper_1 = require("./helper");
const utility_1 = require("../utility");
const newspaper_1 = require("../../model/newspaper");
const DAILY_STAR_URI = "https://www.thedailystar.net/";
const scrape = async () => {
    try {
        console.log("The daily star headlines scrapper");
        let $ = await request_promise_1.default(helper_1.options(DAILY_STAR_URI));
        $(helper_1.HEADLINE_ITEM_SELECTOR)
            .eq(0)
            .find("li")
            .each(async (_, ele) => {
            const title = utility_1.onlyTextContent($($(ele).find(".list-content a")));
            const link = utility_1.getAttrValue($($(ele).find(".list-content a")), "href");
            // console.log(title);
            if (link && link !== "#" && link !== "" && title) {
                const newNews = await helper_1.getDailyStarInfo(newspaper_1.NewsType.HEADLINES, title, `https://www.thedailystar.net${link}`);
                if (newNews) {
                    utility_1.saveHeadline(newNews);
                }
            }
        });
        // saveHeadline(newNews, NewspaperName.PROTHOM_ALO);
    }
    catch (e) {
        console.log("Error in scrapper [daily-star]", e);
    }
};
// scrape();
exports.default = scrape;
