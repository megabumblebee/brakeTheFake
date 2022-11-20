import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Information} from "../../information/entities/information.entity";
import {Source} from "../../source/entities/source.entity";
import {Category} from "../../category/entities/category.entity";

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

  @ManyToOne(
    type => Information,
    entity => entity.news,
  )
  information: Information;

  @Column({
    type: 'float',
  })
  score: number;

  @Column({
    type: 'float',
  })
  comparative: number;
}
