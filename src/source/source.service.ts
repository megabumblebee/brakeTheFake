import { Injectable } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import {Category} from "../category/entities/category.entity";
import {Source} from "./entities/source.entity";

@Injectable()
export class SourceService {
  create(createSourceDto: CreateSourceDto) {
    return 'This action adds a new source';
  }

  findAll() {
    return `This action returns all source`;
  }

  findOne(id: number) {
    return `This action returns a #${id} source`;
  }

  update(id: number, updateSourceDto: UpdateSourceDto) {
    return `This action updates a #${id} source`;
  }

  remove(id: number) {
    return `This action removes a #${id} source`;
  }

  async createDummySources() {
    const sources = [
      {
        name: 'Puls Biznesu',
        url: 'https://www.pb.pl/rss/najnowsze.xml',
      },{
        name: 'Polsat News',
        url: 'https://www.polsatnews.pl/rss/wszystkie.xml',
      },{
        name: 'Bankier',
        url: 'https://www.bankier.pl/rss/wiadomosci.xml',
      },{
        name: 'Dobre wieści',
        url: 'http://www.dobre-wiesci.pl/feed',
      },{
        name: 'TVN 24',
        url: 'http://www.tvn24.pl/polska.xml',
      },{
        name: 'Tok FM',
        url: 'http://www.tokfm.pl/pub/rss/tokfmpl_polska.xml',
      },{
        name: 'CentrumPR',
        url: 'https://centrumpr.pl/artykuly.rss',
      },{
        name: 'onet.pl',
        url: 'https://wiadomosci.onet.pl/9,sitemap-news.xml',
      },{
        name: 'wp.pl',
        url: 'https://wiadomosci.wp.pl/newssitemap.xml',
      },{
        name: 'RMF 24',
        url: 'https://www.rmf24.pl/fakty/polska/feed',
      },
    ];
    for (const source of sources) {
      if (!await Source.findOneBy({name: source.name})) {
        const newSource = new Source();
        newSource.name = source.name;
        newSource.url = source.url;

        await newSource.save();
      }
    }
    return {success: true};
  }
}
