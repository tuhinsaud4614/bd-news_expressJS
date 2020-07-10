"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Comment {
    constructor(text, commenter, news, id = "") {
        this.text = text;
        this.commenter = commenter;
        this.news = news;
        this.id = id;
    }
    get topMap() {
        return {
            text: this.text,
            commenter: this.commenter,
        };
    }
}
exports.Comment = Comment;
