"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewspaperName;
(function (NewspaperName) {
    NewspaperName["BD_NEWS_24"] = "BD_NEWS_24";
    NewspaperName["PROTHOM_ALO"] = "PROTHOM_ALO";
    NewspaperName["THE_DAILY_STAR"] = "THE_DAILY_STAR";
})(NewspaperName = exports.NewspaperName || (exports.NewspaperName = {}));
var NewsType;
(function (NewsType) {
    NewsType["HEADLINES"] = "HEADLINES";
    NewsType["TOP_STORIES"] = "TOP_STORIES";
})(NewsType = exports.NewsType || (exports.NewsType = {}));
class News {
    constructor(newsType, newspaperName, title, link, description, publishedBy = null, category = null, subTitle = null, publishedDate = null, updatedDate = null, imageUri = null, imageCaption = null, comments = [], id = "") {
        this.newsType = newsType;
        this.newspaperName = newspaperName;
        this.title = title;
        this.link = link;
        this.description = description;
        this.publishedBy = publishedBy;
        this.category = category;
        this.subTitle = subTitle;
        this.publishedDate = publishedDate;
        this.updatedDate = updatedDate;
        this.imageUri = imageUri;
        this.imageCaption = imageCaption;
        this.comments = comments;
        this.id = id;
    }
    get topMap() {
        return {
            newsType: this.newsType,
            newspaperName: this.newspaperName,
            title: this.title,
            link: this.link,
            description: this.description,
            publishedBy: this.publishedBy,
            category: this.category,
            subTitle: this.subTitle,
            publishedDate: this.publishedDate,
            updatedDate: this.updatedDate,
            imageUri: this.imageUri,
            imageCaption: this.imageCaption,
            comments: [],
        };
    }
}
exports.News = News;
