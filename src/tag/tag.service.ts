import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {Source} from "../source/entities/source.entity";
import {Tag} from "./entities/tag.entity";

@Injectable()
export class TagService {
  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }

  async createDummyTags() {
    const tags = [
      "Minister",
      "Handel",
      "UE",
      "Finanse",
      "Ukraina",
      "PSE",
      "Inwestycje",
      "Infrastruktura",
      "NATO",
      "Ameryka",
      "USA",
      "Trump",
      "Dolar",
      "Rewolucja",
      "PZU",
      "Chiny",
      "Kanada",
      "Inflacja",
      "Historia",
      "Kobiety",
      "Francja",
      "ESG",
      "Biznes",
      "MFiPR",
      "Euro",
      "Japonia",
      "Policja",
      "Niemcy",
      "Morderstwo",
      "Wiceminister",
      "KE",
      "Turcja",
      "Uczniowie",
      "Lewandowski",
      "Mundial",
      "Tusk",
      "PiS",
      "Hiszpania",
      "Finlandia",
      "KO",
      "FiFA",
      "OC",
      "Pogoda",
      "FBI",
      "Samoloty",
      "IMGW",
      "Morawiecki",
      "MSWiA",
      "Netflix",
      "CV",
      "CIA",
      "Eksplozja",
      "Tragedia",
      "Portugalia",
      "Rosja",
      "Putin",
      "Warszawa",
      "Prezydent",
      "MMA",
      "Europa",
      "WOPR",
      "Niedziela",
      "Zbrodnia",
      "Lotto",
      "KPO",
    ];

    for (const tag of tags) {
      if (!await Tag.findOneBy({name: tag})) {
        const newTag = new Tag();
        newTag.name = tag;

        await newTag.save();
      }
    }
    return {success: true};
  }
}
