import {BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Source} from "../../source/entities/source.entity";
import {Category} from "../../category/entities/category.entity";
import {Tag} from "../../tag/entities/tag.entity";
import {NewsFactor} from "./news-factor.entity";

@Entity()
export class News extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
    default: null,
  })
  abstract: string;

  @ManyToOne(
    type => Category,
    entity => entity.news,
  )
  category: Category;

  @ManyToOne(
    type => Source,
    entity => entity.news,
  )
  source: Source;

  @Column({
    nullable: true,
    default: null,
  })
  timestamp: Date;

  @Column()
  url: string;

  @Column({
    type: 'float',
  })
  score: number;

  @Column({
    type: 'float',
  })
  comparative: number;

  @ManyToMany(
    type => Tag,
    entity => entity.news,
  )
  tags: Tag[];

  @OneToOne(
    type => NewsFactor,
    entity => entity.news,
  )
  @JoinColumn()
  newsFactor: NewsFactor;
}
