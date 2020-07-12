import { NewspaperName } from "./newspaper";
export class User {
  constructor(
    public name: string,
    public email: string,
    public avatar: string | null,
    public address: string | null,
    public resetToken: string | undefined,
    public resetTokenExp: string | undefined,
    public resetTokenIsVerified: boolean | undefined,
    public id: string = ""
  ) {}

  get topMap() {
    return {
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      address: this.address,
    };
  }
}

export class Favorite {
  constructor(
    public newsies: NewspaperName[],
    public user: User,
    public id: string = ""
  ) {}

  get topMap() {
    return {
      news: this.newsies,
      user: this.user,
    };
  }
}
