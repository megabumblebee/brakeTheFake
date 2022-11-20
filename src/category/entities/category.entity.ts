import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Information} from "../../information/entities/information.entity";
import {News} from "../../news/entities/news.entity";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 250,
  })
  name: string;

  @OneToMany(
    type => News,
    entity => entity.category,
  )
  news: News[];

  @OneToMany(
    type => Information,
    entity => entity.category,
  )
  information: Information[];
}