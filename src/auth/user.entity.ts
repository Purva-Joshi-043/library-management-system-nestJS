
import { Book } from 'src/books/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './enums/role.enum';
import { RoleGuard } from './guards/role.guard';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  // NOTE: remove blank line
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  role: Roles; // NOTE: use Roles[]

  @OneToMany((type) => Book, (book) => book.issuedTo, { eager: true }) 
  books: Book[];
}
