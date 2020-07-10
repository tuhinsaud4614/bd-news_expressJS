import { User } from './user';
import { News } from './newspaper';
export class Comment {
  constructor(
    public text: string,
    public commenter: string | User,
    public news: string | News,
    public id: string = ""
  ) {}

  get topMap() {
    return {
      text: this.text,
      commenter: this.commenter,
    };
  }
}
