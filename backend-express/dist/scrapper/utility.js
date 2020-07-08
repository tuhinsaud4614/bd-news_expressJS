"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const news_1 = require("../model/db/news");
exports.textContent = (cheerio) => {
    if (cheerio) {
        return cheerio
            .text()
            .replace(/\n|BdST|\t+|\s+/g, " ")
            .trim();
    }
    return null;
};
exports.onlyTextContent = (cheerio) => {
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
exports.isEmpty = (value) => {
    return (value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0));
};
exports.getAttrValue = (cheerio, attrName) => {
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
exports.saveTopStory = async (topStory) => {
    try {
        const currentTopStory = await news_1.NewsModel.findOne({
            title: topStory.title,
            newspaperName: topStory.newspaperName,
        });
        if (!currentTopStory) {
            const resTopStory = await new news_1.NewsModel(topStory.topMap).save();
            console.log(resTopStory._id, "News save in top story successfully!");
        }
    }
    catch (err) {
        console.log("Error to save news in top stories", err);
    }
};
exports.saveHeadline = async (headline) => {
    try {
        const currentHeadline = await news_1.NewsModel.findOne({
            title: headline.title,
            newspaperName: headline.newspaperName,
        });
        if (!currentHeadline) {
            const resHeadline = await new news_1.NewsModel(headline.topMap).save();
            console.log(resHeadline._id, "News save in headline save successfully!");
        }
    }
    catch (err) {
        console.log("Error to save news in headlines", err);
    }
};
