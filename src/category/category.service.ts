import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {User} from "../user/entities/user.entity";
import {hashPwd} from "../utils/hash-pwd";
import {saltRounds} from "../config/jwt.config";
import {Category} from "./entities/category.entity";


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
    const categories = ["Ministerstwo Finansów","Minister Finansów","Rzecznik Prasowy MF","Generalny Inspektor Informacji Finansowej (GIIF)","Wiceminister finansów","Budżet państwa","Dług publiczny","Stabilizująca Reguła Wydatków (SRW)","Obligacje skarbowe","Deficyt budżetowy","Wieloletni Plan Finansowy Państwa","Gwarancje i Finansowanie","Gry Hazardowe","Podatki, cło","PIT","CIT","Akcyza ","VAT","Krajowa Administracja Skarbowa","Szef Krajowej Administracji Skarbowej","Rzecznik prasowy Szefa KAS","Izba Administracji Skarbowej","Urząd Skarbowy","Służba Celno-Skarbowa","Funkcjonariusze Celno-Skarbowi","Krajowa Informacja Skarbowa","Krajowa Szkoła Skarbowości","Polski Ład","Twój e-Pit","e-Urząd Skarbowy","Slim VAT","Aktualizacja Programu Konwergencji","Podatek Reklamowy","Estoński CIT","Strategia Rozwoju Rynku Kapitałowego","Głos Podatnika","Finansoaktywni","Polska Agencja Nadzoru Audytowego","Centralny Rejestr Beneficjentów Rzeczywistych","Wakacje Kredytowe","Naodowy Bank Polski","Rada Polityki Pieniężnej","Międzynarodowy Fundusz Walutowy","Komisja Nadzoru Finansowego","Magdalena Rzeczkowska","Anna Chałupa","Piotr Patkowski","Sebastian Skuza","Łukasz Czernicki","Katarzyna Szwarc","Mariusz Gojny","Artur Soboń","Katarzyna Szweda","Bartosz Zbaraszczuk","Justyna Pasieczyńska","Patrycja Dudek","Viatoll","e-Toll","e-myto","KPO"];
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
