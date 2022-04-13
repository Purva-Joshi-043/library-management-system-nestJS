import { User } from "src/auth/user.entity";
import { Column, Entity, IsNull, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookGenre } from "./enum/book-genre-enum";

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  genre: BookGenre;

  @ManyToOne((type) => User, (user) => user.books, { eager: false })
  issuedTo: User;

}