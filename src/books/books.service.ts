import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { Book } from './book.entity';
import { BooksRepository } from './books.repository';
import { AddBookDto } from './dto/add-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { IssueBookDto } from './dto/issue-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

export class BooksService {
  constructor(
    @InjectRepository(BooksRepository)
    private booksRepository: BooksRepository,

    private authService: AuthService,
  ) {}

  getBooks(filterDto: GetBookFilterDto, user: User): Promise<Book[]> {
    return this.booksRepository.getBooks(filterDto, user);
  }

  async getBookById(id: string): Promise<Book> {
    try {
      const found = await this.booksRepository.findOne({ where: { id } });
      if (!found) {
        throw new NotFoundException(`Book with ID "${id}" not found`);
      }

      return found;
    } catch (error) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
  }

  addBook(addBookDto: AddBookDto): Promise<Book> {
    return this.booksRepository.addBook(addBookDto);
  }

  async removeBook(id: string): Promise<void> {
    const result = await this.booksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
  }

  async issueBook(issueBookDto: IssueBookDto): Promise<Book> {
    const { bookId, userId } = issueBookDto;
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
      relations: ['issuedTo'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID "${bookId}" not found`);
    }
    if (book.issuedTo) {
      throw new ConflictException(
        `Book with ID "${bookId}" is already issued by someone else`,
      );
    }
    const user = await this.authService.getUser(userId);

    book.issuedTo = user;
    await this.booksRepository.save(book);

    return book;
  }

  async returnBook(returnBookDto: ReturnBookDto): Promise<Book> {
    const { bookId, userId } = returnBookDto;
    const book = await this.booksRepository.findOne({
      where: { id:bookId },
      relations: ['issuedTo'],
    });
    console.log(book);
    if (!book) {
      throw new NotFoundException(`Book with ID "${bookId}" not found`);
    }

    if (book.issuedTo?.id !== userId) {
      throw new ConflictException(
        `Book with ID "${bookId}" is not issued by this user`,
      );
    }
    book.issuedTo = null;
    await this.booksRepository.save(book);
    return book;
  }

  async getIssuedBook(user: User): Promise<Book[]> {
    const books = await user.books;
    return books;
  }
}
