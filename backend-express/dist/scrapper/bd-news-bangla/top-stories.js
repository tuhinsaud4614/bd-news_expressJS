"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const helper_1 = require("./helper");
const newspaper_1 = require("../../model/newspaper");
const utility_1 = require("../utility");
// import { TopStoryModel } from "../../model/db/headlines-and-news";
const BD_NEWS_URL = "https://bangla.bdnews24.com";
const scrape = async () => {
    try {
        console.log("Bd news 24 bangla Top Stories Scrapper");
        let $ = await request_promise_1.default(helper_1.options(BD_NEWS_URL));
        const s1 = "#other_top_stories_home_css > .article a";
        if ($(s1)) {
            $(s1).each(async (_, element) => {
                const title = $(element).text().replace(/\s+/g, " ").trim();
                let link = utility_1.getAttrValue($(element), "href");
                // console.log(`index ${_}: title = ${title}, link = ${link}`);
                if (link && link !== "#" && link !== "") {
                    const newNews = await helper_1.getBdNews24Info(newspaper_1.NewsType.TOP_STORIES, link, title);
                    if (newNews) {
                        utility_1.saveTopStory(newNews);
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
