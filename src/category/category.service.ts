import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {User} from "../user/entities/user.entity";
import {hashPwd} from "../utils/hash-pwd";
import {saltRounds} from "../config/jwt.config";
import {Category} from "./entities/category.entity";
import {categories} from "../data/categories";


@Injectable()
export class CategoryService {
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async createDummyCategories() {
    for (const category of categories) {
      if (!await Category.findOneBy({name: category})) {
        const newCategory = new Category();
        newCategory.name = category;
        await newCategory.save();
      }
    }
    return {success: true};
  }
}
