import { Injectable } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import {Source} from "./entities/source.entity";
import {sources} from "../data/sources";

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
    for (const source of sources) {
      if (!await Source.findOneBy({name: source.name})) {
        const newSource = new Source();
        newSource.name = source.name;
        newSource.url = source.url;
        newSource.factor = 0.5;

        await newSource.save();
      }
    }
    return {success: true};
  }
}
