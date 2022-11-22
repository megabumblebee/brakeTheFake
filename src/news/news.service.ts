import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {Cron} from "@nestjs/schedule";
import {XMLParser} from "fast-xml-parser";
import {Source} from "../source/entities/source.entity";
import {News} from "./entities/news.entity";
import {Category} from "../category/entities/category.entity";
import * as cheerio from 'cheerio';
import * as sentimentCalc from 'sentiment-polish';
import {fakeWords} from "../data/fakeWords";
import {legitWords} from "../data/legitWords";
import {newsFrequency, factorWeights, savingWithoutCategories} from "../config/app.config";
import {transformNewsFromSource} from "../data/source-transformer";
import {analyzeText, calculateAuthority, calculateLegitimacy, getTags} from "../utils/work-with-text";
import {Tag} from "../tag/entities/tag.entity";
const axios = require('axios');
const {convert} = require('html-to-text');

@Injectable()
export class NewsService {

  @Cron(`00 */${newsFrequency} * * * *`)
  handleCronEveryMinute() {
    this.downloadFeed();
  }

  @Cron('00 00 00 * * *')
  handleCronDaily() {
    this.updateSourceFactor();
  }

  async updateSourceFactor() {
    console.log("Updating factor for sources...")
    const sourceEntities = await Source.find({
      relations: {news: true},
    });

    for (const sourceEntity of sourceEntities) {
      const lastNews = sourceEntity.news.filter(news => news.timestamp >= new Date(Date.now() - 1000 * 60 * 60 * 24));
      const dailyTabOfLegit = [];
      for (const newsFromSource of lastNews) {
        const news = await News.findOne({
          where: {id: newsFromSource.id},
        });
        const tabOfLegit = this.calcAllFakeFactor(news);
        dailyTabOfLegit.push(tabOfLegit.reduce((prev, curr) => prev + curr, 0));
      }
      if(dailyTabOfLegit.length > 0){
        const todayLegit = dailyTabOfLegit.reduce((prev, curr) => prev + curr, 0)/dailyTabOfLegit.length;
        if(todayLegit > 0.8) sourceEntity.factor < 1 ? sourceEntity.factor += 0.02 : sourceEntity.factor;
        else if(todayLegit > 0.6) sourceEntity.factor += 0.01;
        else if(todayLegit > 0.2 && todayLegit < 0.4) sourceEntity.factor -= 0.01;
        else if(todayLegit > 0) sourceEntity.factor > 0 ? sourceEntity.factor -= 0.02 : sourceEntity.factor;

        await sourceEntity.save();
      }
    }
    console.log("Updating factor completed...")
    return {
      success: true,
    }
  }


  create(createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }

  private calcAllFakeFactor(one: News) {
    let tabOfLegit;
    if(one.usersFactor === null) {
      const factorSum = factorWeights.authority + factorWeights.sentiment + factorWeights.legitimacy + factorWeights.source;
      tabOfLegit = [
        one.authorityFactor * factorWeights.authority / factorSum,
        one.sentimentFactor * factorWeights.sentiment / factorSum,
        one.legitimacyFactor * factorWeights.legitimacy / factorSum,
        one.sourceFactor * factorWeights.source / factorSum,
      ];
    } else {
      tabOfLegit = [
        one.authorityFactor * factorWeights.authority,
        one.sentimentFactor * factorWeights.sentiment,
        one.legitimacyFactor * factorWeights.legitimacy,
        one.usersFactor * factorWeights.users,
        one.sourceFactor * factorWeights.source,
      ];
    }
    return tabOfLegit;
  }

  async findAll() {
    const news = await News.find({relations: {source: true, tags: true, category: true}});

    return news
      .filter(one => one.timestamp >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30))
      .map(one => {
        const tabOfLegit = this.calcAllFakeFactor(one);

        return {
          id: one.id,
          title: one.title,
          abstract: one.abstract,
          category: one.category ? one.category.name : null,
          url: one.url,
          sourceName: one.source.name,
          sourceUrl: one.source.url,
          timestamp: one.timestamp,
          tags: one.tags.map(tag => tag.name),
          sentiment: one.sentiment,
          authorityFactor: one.authorityFactor,
          sentimentFactor: one.sentimentFactor,
          legitimacyFactor: one.legitimacyFactor,
          usersFactor: one.usersFactor,
          sourceFactor: one.sourceFactor,
          brakeFactor: tabOfLegit.reduce((prev, curr) => prev + curr, 0),
        }
      })
      .sort((a,b) => b.brakeFactor - a.brakeFactor);
    return null;
  }

  findOne(id: string) {
    return `This action returns a ${id} news`;
  }

  update(id: string, updateNewsDto: UpdateNewsDto) {
    return `This action updates a ${id} news`;
  }

  remove(id: string) {
    return `This action removes a ${id} news`;
  }

  async downloadFeed() {
    console.log("Downloading news...")
    const parser = new XMLParser();
    const allSources = await Source.find();

    const allCategories = await Category.find({relations: {news: true}});
    const countNewsForCategories = allCategories.map(category => category.news.length);

    const allTags = await Tag.find();

    for (const sourceEntity of allSources) {
      // I don't know why but this site often throws an error on the first connection and works fine on the second
      if (sourceEntity.url === "https://wiadomosci.wp.pl/newssitemap.xml") {
        try {
          await axios.get(sourceEntity.url);
        } catch (e) {
        }
      }

      try {
        const {data} = await axios.get(sourceEntity.url);
        const jsonSourceNewsObj = parser.parse(data);

        const allNewsFromSourceToDatabase = transformNewsFromSource(jsonSourceNewsObj, sourceEntity.url);

        for (const feedNews of allNewsFromSourceToDatabase) {

          const findThisNewsInDb = await News.findOneBy({url: feedNews.link});
          if(!findThisNewsInDb) {
            const newNews = new News();
            newNews.title = feedNews.title;
            newNews.timestamp = new Date(feedNews.timestamp);
            newNews.url = feedNews.link;
            newNews.source = sourceEntity;
            newNews.sourceFactor = sourceEntity.factor;
            newNews.usersFactor = null;

            newNews.abstract = feedNews.description;

            if(feedNews.description){
              if((feedNews.description.includes('<p>') || feedNews.description.includes('<img'))){
                const $ = cheerio.load(feedNews.description);
                newNews.abstract = $('p').text();
              } else {
                newNews.abstract = feedNews.description;
              }
            } else {
              newNews.abstract = null;
            }

            let titleSentiment = sentimentCalc(newNews.title); //score, comparative, tokens.length

            const {data: article} = await axios.get(feedNews.link)

            const articleTags = [];
            const articleSentiment = [];
            const legitimacyFactor = [];
            const authorityFactor = [];
            const categories = [];

            try {
              const $ = cheerio.load(article);
              $('p').each((index, article) => {
                const oneParagraph = $(article).text();
                const pureParagraphText = convert(oneParagraph, {wordwrap: false});

                articleSentiment.push(sentimentCalc(pureParagraphText));
                legitimacyFactor.push(calculateLegitimacy(pureParagraphText, fakeWords, legitWords));
                authorityFactor.push(calculateAuthority(pureParagraphText));


                for (const index of allCategories.keys()) {
                  if(analyzeText(allCategories[index].name, feedNews.title))
                    categories.push({category: allCategories[index], count: countNewsForCategories[index]});
                  if(analyzeText(allCategories[index].name, pureParagraphText))
                    categories.push({category: allCategories[index], count: countNewsForCategories[index]});
                }

                const tagsInParagraph = getTags(pureParagraphText, allTags.map(tag => tag.name));
                for (const tagInParagraph of tagsInParagraph) {
                  if(!articleTags.includes(tagInParagraph)) articleTags.push(tagInParagraph);
                }
              });
            } catch (e) {
              console.log('### Problem with article from : ' + feedNews.link)
            } // end of work with cheerio
            if(savingWithoutCategories || categories.length > 0) {

              // legitimacyFactor;
              // authorityFactor;
              // articleSentiment;
              // titleSentiment;
              //       const sentimentFactor = 1 - Math.abs(newNews.score) * 0.01;
              //       newNews.sentimentFactor = (sentimentFactor < 0 ? 0 : sentimentFactor) * weights.sentiment;
              let sumOfSentimentPoints = 0;
              let countWords = 0;
              for (const paragraphSentiment of articleSentiment) {
                sumOfSentimentPoints += paragraphSentiment.score;
                countWords += paragraphSentiment.tokens.length;
              }
              //sentiment in title is more important
              sumOfSentimentPoints += titleSentiment.score * 10;
              countWords += titleSentiment.tokens.length;
              newNews.sentiment = sumOfSentimentPoints/countWords*10;
              if(newNews.sentiment < -1) newNews.sentiment = -1;
              if(newNews.sentiment > 1) newNews.sentiment = 1;

              if(legitimacyFactor)
                newNews.legitimacyFactor = legitimacyFactor.reduce((prev, curr) => prev + curr, 0)/legitimacyFactor.length;
              else
                newNews.legitimacyFactor = 0.5

              const authoritySum = authorityFactor.reduce((prev, curr) => prev+curr, 0);
              newNews.authorityFactor = authoritySum > 1 ? 1 : authoritySum;

              newNews.sentimentFactor = 1 - Math.abs(newNews.sentiment);

              newNews.tags = [];
              for (const articleTag of articleTags) {
                let tagEntity = await Tag.findOne({where: {name: articleTag}});
                if (tagEntity) {
                  newNews.tags.push(tagEntity);
                }
              }

              if(categories.length > 0){
                // the less news about a category, the more detailed it is
                categories.sort((a,b) => a.count - b.count);
                newNews.category = categories[0].category;
              } else {
                newNews.category = null;
              }

              await newNews.save();
            }
          }
        }


      } catch (e) {
        console.log('### Problem with news from : ' + sourceEntity.url);
      }
    }
    console.log("Downloading success!")
    return {success: true};
  }
}
