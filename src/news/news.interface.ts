import {Source} from "../source/entities/source.entity";

export interface Webpage {
  sourceName: string;
  rss: {channel: {item: Item[]}};
  urlset: {url: Url[]};
  sourceUrl: string;
}

export interface Item {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface Url {
  loc: string;
}

export interface Feed {
  timestamp: Date;
}

export interface NewsRes {
  title: string;
  description: string;
  link: string;
  timestamp: Date,
  source: Source,
  sourceUrl: string;
}