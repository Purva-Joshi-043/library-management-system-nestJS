import { InternalServerErrorException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { BookGenre } from "./enum/book-genre-enum";
import { Book } from "./book.entity";
import { AddBookDto } from "./dto/add-book.dto";
import { GetBookFilterDto } from "./dto/get-book-filter.dto";

@EntityRepository(Book)
export class BooksRepository extends Repository<Book> {
  async getBooks(filterDto: GetBookFilterDto, user: User): Promise<Book[]> {
    const { genre, title, author } = filterDto;
    // NOTE: Achieve this without the querybuilder
    const query = this.createQueryBuilder('book');
  
    if (genre) {
      query.andWhere('book.genre = :genre', { genre });
    }
    if (author) {
      query.andWhere('book.author = :author', { author });
    }

    if (title) {
      query.andWhere('book.title = :title', { title });
    }

    try {
      const books = await query.getMany();
      return books;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async addBook(addBookDto: AddBookDto): Promise<Book> {
    const { title, author,genre } = addBookDto;

    const book = this.create({
      title ,
      author,
      genre:BookGenre.FANTASY, // NOTE: remove hard-coded value
    });
    await this.save(book);
    return book;
  }
}