"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const helper_1 = require("./helper");
const utility_1 = require("../utility");
const newspaper_1 = require("../../model/newspaper");
const DAILY_STAR_URI = "https://www.thedailystar.net/top-news";
const scrape = async () => {
    var _a;
    try {
        console.log("The daily star top-stories scrapper");
        let $ = await request_promise_1.default(helper_1.options(DAILY_STAR_URI));
        (_a = $(helper_1.TOP_STORY_ITEM_SELECTOR)) === null || _a === void 0 ? void 0 : _a.each(async (_, ele) => {
            const title = utility_1.onlyTextContent($(ele));
            const link = utility_1.getAttrValue($(ele), "href");
            if (link && link !== "#" && link !== "" && title) {
                const newNews = await helper_1.getDailyStarInfo(newspaper_1.NewsType.TOP_STORIES, title, `https://www.thedailystar.net${link}`);
                if (newNews) {
                    utility_1.saveTopStory(newNews);
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
