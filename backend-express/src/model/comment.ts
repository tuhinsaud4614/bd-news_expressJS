export class Comment {
  constructor(
    public text: string,
    public commenter: { name: string; avatar: string },
    public id: string = ""
  ) {}

  get topMap() {
    return {
      text: this.text,
      commenter: this.commenter,
    };
  }
}
