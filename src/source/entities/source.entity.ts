import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {News} from "../../news/entities/news.entity";

@Entity()
export class Source extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @OneToMany(
    type => News,
    entity => entity.source,
  )
  news: News[];

  @Column({
    type: 'float',
    default: 0.5,
  })
  factor: number;
}
