import {Comment} from "./comment"

export enum NewspaperName {
  BD_NEWS_24 = "BD_NEWS_24",
  PROTHOM_ALO = "PROTHOM_ALO",
  THE_DAILY_STAR = "THE_DAILY_STAR",
}

export enum NewsType {
  HEADLINES = "HEADLINES",
  TOP_STORIES = "TOP_STORIES",
}

export class News {
  constructor(
    public newsType: NewsType,
    public newspaperName: NewspaperName,
    public title: string,
    public link: string,
    public description: string[],
    public publishedBy: string | null = null,
    public category: string | null = null,
    public subTitle: string | null = null,
    public publishedDate: string | null = null,
    public updatedDate: string | null = null,
    public imageUri: string | null = null,
    public imageCaption: string | null = null,
    public comments: string[] | Comment[] = [],
    public id: string = ""
  ) {}

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
