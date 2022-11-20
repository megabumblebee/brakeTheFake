import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "../../category/entities/category.entity";
import {News} from "../../news/entities/news.entity";

@Entity()
export class Information extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    type => News,
    entity => entity.information,
  )
  news: News[];

  @ManyToOne(
    type => Category,
    entity => entity.information,
  )
  category: Category;
}
