import {BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Source} from "../../source/entities/source.entity";
import {Category} from "../../category/entities/category.entity";
import {Tag} from "../../tag/entities/tag.entity";

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

  @Column({
    unique: true,
  })
  url: string;

  @Column({
    type: 'float',
  })
  sentiment: number;

  @ManyToMany(
    type => Tag,
    entity => entity.news,
  )
  tags: Tag[];

  @Column({
    type: 'float',
  })
  sourceFactor: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  usersFactor: number;

  @Column({
    type: 'float',
  })
  legitimacyFactor: number;

  @Column({
    type: 'float',
  })
  authorityFactor: number;

  @Column({
    type: 'float',
  })
  sentimentFactor: number;
}
