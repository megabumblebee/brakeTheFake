import {BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {News} from "./news.entity";

@Entity()
export class NewsFactor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(
    type => News,
    entity => entity.newsFactor,
  )
  news: News;

  @Column({
    type: 'float',
  })
  source: number;

  @Column({
    type: 'float',
  })
  users: number;

  @Column({
    type: 'float',
  })
  legitimacy: number;

  @Column({
    type: 'float',
  })
  authority: number;

  @Column({
    type: 'float',
  })
  sentiment: number;
}