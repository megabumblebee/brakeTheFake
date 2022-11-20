import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {Cron} from "@nestjs/schedule";
import {XMLParser} from "fast-xml-parser";
import * as fs from "fs";
import {Source} from "../source/entities/source.entity";
import {News} from "./entities/news.entity";
import {Feed, NewsRes, Webpage} from "./news.interface";
import {User} from "../user/entities/user.entity";
import {MoreThan} from "typeorm";
import {Category} from "../category/entities/category.entity";
const axios = require('axios');
const cheerio = require('cheerio');
const { convert } = require('html-to-text');
const sentiment = require('sentiment-polish');

@Injectable()
export class NewsService {

  @Cron('00 * * * * *')
  handleCron() {
    this.downloadFeed();
  }

  replaceWhiteChars(text) {
    const whiteChars = ',."():;!?';
    [...whiteChars].forEach(
      (whiteChars) => (text = text.replaceAll(whiteChars, ""))
    );
    text = text.replaceAll(" - ", " ");
    return text;
  };

  analyzeText(search, topic) {
    search = this.replaceWhiteChars(search)
      .toLowerCase()
      .split(" ")
      .map((word) => word.slice(0, word.length - Math.floor(word.length * 0.25)));
    topic = this.replaceWhiteChars(topic).toLowerCase().split(" ");
    // console.log(topic);
    let isValid = true;
    search.forEach((s) => {
      if (!topic.find((word) => word.startsWith(s))) {
        isValid = false;
      }
    });
    return isValid;
  };

  create(createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }

  async findAll() {
    const news = await News.find();
    return news
      .filter(one => one.timestamp >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30))

      ;

    // const articles = [];

    // const res = await axios.get('https://wiadomosci.onet.pl/kraj')
    // const html = res.data;
    //
    //

    // const $ = cheerio.load(html)
    // $('a[title]:contains("Black")', html).each((index, article) => {
    //   const title = $(article).attr('title');
    //   const url = $(article).attr('href');
    //
    //   articles.push({
    //     title,
    //     url,
    //   })
    // })



    return null;
  }

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }

  async downloadFeed() {
    const parser = new XMLParser();
    const feeds = (await Source.find()).map(source => source.url);

    // for (const feed of feeds) {
    //   const {data} = await axios.get(feed);
    //   const jObj = parser.parse(data);
    //
    //   console.log(jObj)
    //
    //   const feedEntity = {
    //     ...jObj,
    //     // source: feed,
    //     // sourceName: feed.split("://").slice(1).join("").split("/")[0],
    //   };
    //   console.log(feedEntity)
    // }

    const feedsResults = feeds.map(async (feed, i) => {
      return new Promise(async (res, rej) => {
        try {
          const {data} = await axios.get(feed);
          const jObj = parser.parse(data);
          res({
            ...jObj,
            sourceUrl: feed,
            // sourceName: feed.split("://").slice(1).join("").split("/")[0],
          });
        } catch (err) {
          res({});
        }
      });
    });

    let res = await Promise.all(feedsResults);

    res = res.map((webpage: Webpage) => {
      if (webpage.sourceUrl === "https://www.pb.pl/rss/najnowsze.xml") {
        return webpage.rss.channel.item.map((i) => ({
          title: i.title,
          link: i.link,
          description: i.description,
          timestamp: new Date(i.pubDate),
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "https://www.polsatnews.pl/rss/wszystkie.xml") {
        return webpage.rss.channel.item.map((i) => ({
          title: i.title,
          link: i.link,
          description: i.description,
          timestamp: new Date(i.pubDate),
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "https://www.bankier.pl/rss/wiadomosci.xml") {
        return webpage.rss.channel.item.map((i) => ({
          title: i.title,
          link: i.link,
          description: i.description,
          timestamp: new Date(i.pubDate),
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "http://www.dobre-wiesci.pl/feed") {
        return webpage.rss.channel.item.map((i) => ({
          title: i.title,
          link: i.link,
          description: i.description,
          timestamp: new Date(i.pubDate),
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "http://www.tvn24.pl/polska.xml") {
        return webpage.rss.channel.item.map((i) => ({
          title: i.title,
          link: i.link,
          description: i.description,
          timestamp: new Date(i.pubDate),
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "http://www.tokfm.pl/pub/rss/tokfmpl_polska.xml") {
        return webpage.rss.channel.item.map((i) => ({
          title: i.title,
          link: i.link,
          description: i.description,
          timestamp: new Date(i.pubDate),
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "https://centrumpr.pl/artykuly.rss") {
        return webpage.rss.channel.item.map((i) => ({
          title: i.title,
          link: i.link,
          description: i.description,
          timestamp: new Date(i.pubDate),
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "wiadomosci.onet.pl") {
        return webpage.urlset.url.map((i) => ({
          title: i["news:news"]["news:title"],
          link: i.loc,
          timestamp: new Date(i["news:news"]["news:publication_date"]),
          description: null,
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "https://wiadomosci.onet.pl/9,sitemap-news.xml") {
        return webpage.urlset.url.map((i) => ({
          title: i["news:news"]["news:title"],
          link: i.loc,
          timestamp: new Date(i["news:news"]["news:publication_date"]),
          description: null,
          sourceUrl: webpage.sourceUrl,
        }));
      } else if (webpage.sourceUrl === "http://www.tvn24.pl/polska.xml") {
        return webpage.rss.channel.item.map((i) => ({
          title: i.title,
          description: i.description,
          link: i.link,
          timestamp: new Date(i.pubDate),
          sourceUrl: webpage.sourceUrl,
        }));
      }
      return [];
    });

    // @ts-ignore
    const newsRes: NewsRes[] = res
      .flat()
      // .filter(
      //   (feed: Feed) =>
      //     feed.timestamp >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
      // );

    for (const [index, news] of newsRes.entries()) {
      setTimeout(async () => {
      if(!await News.findOneBy({
        title: news.title,
      })){
        const newNews = new News();
        newNews.title = news.title;

        let {score, comparative} = sentiment(newNews.title);

        const abstract = news.description ? news.description : null;

        if(abstract && (abstract.includes('<p>') || abstract.includes('<img'))){
          const $ = cheerio.load(abstract);
          newNews.abstract = $('p').text();
        } else {
          newNews.abstract = abstract;
        }

        newNews.timestamp = new Date(news.timestamp);
        newNews.url = news.link;

        const res = await axios.get(newNews.url)
        const html = res.data;

        const $$ = cheerio.load(html)
        try {
          $$('p', html).each(async (index, article) => {
            const oneParagraph = $$(article).text();
            const pureText = convert(oneParagraph, {wordwrap: false});
            // console.log(pureText);
            const sentimentOfText = sentiment(pureText);
            score += sentimentOfText.score;
            comparative += sentimentOfText.comparative;

            const allCategories = await Category.find();

            const categories = [];
            for (const categoryEntity of allCategories) {
              if(this.analyzeText(categoryEntity.name, news.title))
                categories.push(categoryEntity);
              if(this.analyzeText(categoryEntity.name, pureText))
                categories.push(categoryEntity);
            }
            if(categories.length > 0)
              newNews.category = categories[0];
          });

          newNews.score = score;
          newNews.comparative = comparative;

          const sourceEntity = await Source.findOneBy({url: news.sourceUrl})
          newNews.source = sourceEntity;
          await newNews.save();
        } catch (e) {}
      }
      },100*index);
    }
    return {success: true};
  }
}
