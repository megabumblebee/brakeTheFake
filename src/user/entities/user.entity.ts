import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {Role} from "../role.enum";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 250,
  })
  username: string;

  @Column({
    length: 60,
  })
  pwdHash: string;

  @Column({
    nullable: true,
    default: null,
    length: 50,
  })
  currentTokenId: string;

  @Column('simple-array', {
    nullable: true,
    default: null,
  })
  roles: Role[];
}