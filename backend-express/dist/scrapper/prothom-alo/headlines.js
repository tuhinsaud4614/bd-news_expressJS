"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const newspaper_1 = require("../../model/newspaper");
const helper_1 = require("./helper");
const utility_1 = require("../utility");
const PROTHOM_ALO_URI = "https://www.prothomalo.com/archive";
const scrape = async () => {
    var _a;
    try {
        console.log("Prothom Alo Headlines Scrapper");
        let $ = await request_promise_1.default(helper_1.options(PROTHOM_ALO_URI));
        (_a = $(helper_1.HEADLINE_ITEM_SELECTOR)) === null || _a === void 0 ? void 0 : _a.each(async (_, ele) => {
            var _a;
            const title = utility_1.textContent($(ele).find(".title_holder > .title"));
            const link = utility_1.getAttrValue($(ele).find("a.link_overlay"), "href");
            if (title && link && link !== "#" && link !== "") {
                const publishedBy = (_a = utility_1.textContent($(ele).find(".author"))) === null || _a === void 0 ? void 0 : _a.split(",")[0];
                const category = utility_1.textContent($(ele).find(".category"));
                const newNews = await helper_1.getProthomAloInfo(newspaper_1.NewsType.HEADLINES, title, category, publishedBy, `https://www.prothomalo.com${link}`);
                // console.log(newNews);
                if (newNews) {
                    utility_1.saveHeadline(newNews);
                }
            }
        });
    }
    catch (e) {
        console.log("Error in scrapper [Prothom-Alo]", e);
    }
};
// scrape();
exports.default = scrape;
