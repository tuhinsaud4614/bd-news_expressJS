"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(name, email, avatar, address, id = "") {
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.address = address;
        this.id = id;
    }
    get topMap() {
        return {
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            address: this.address,
        };
    }
}
exports.User = User;
class Favorite {
    constructor(newsies, user, id = "") {
        this.newsies = newsies;
        this.user = user;
        this.id = id;
    }
    get topMap() {
        return {
            news: this.newsies,
            user: this.user,
        };
    }
}
exports.Favorite = Favorite;
