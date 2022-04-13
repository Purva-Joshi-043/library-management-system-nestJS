import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/enums/role.enum';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { RolesDecorator } from 'src/auth/decorators/roles.decorator';
import { User } from 'src/auth/user.entity';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { IssueBookDto } from './dto/issue-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Controller('books')
@UseGuards(AuthGuard())
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  getBooks(
    @Query() filterDto: GetBookFilterDto,
    @GetUser() user: User,
  ): Promise<Book[]> {
    return this.booksService.getBooks(filterDto, user);
  }

  @Get('/issued-book')
  getIssuedBook(@GetUser() user: User): Promise<Book[]> {
    console.log(user);
    return this.booksService.getIssuedBook(user);
  }

  
  @Get('/:id')
  getBookById(@Param('id') id: string): Promise<Book> {
    return this.booksService.getBookById(id);
  }

  @Post('/add-book')
  @UseGuards(RoleGuard)
  @RolesDecorator(Roles.ADMIN)
  addBook(@Body() addBookDto: AddBookDto): Promise<Book> {
    return this.booksService.addBook(addBookDto);
  }

  @Delete('/remove-book')
  @RolesDecorator(Roles.ADMIN)
  @UseGuards(RoleGuard)
  removeBook(@Body('id') id: string): Promise<void> {
    return this.booksService.removeBook(id);
  }

  @UseGuards(RoleGuard)
  @RolesDecorator(Roles.ADMIN)
  @Post('/issue-book')
  issueBook(@Body() issueBookDto: IssueBookDto): Promise<Book> {
    return this.booksService.issueBook(issueBookDto);
  }

  @UseGuards(RoleGuard)
  @RolesDecorator(Roles.ADMIN)
  @Patch('/return-book')
  returnBook(@Body() returnBookDto: ReturnBookDto): Promise<Book> {
    return this.booksService.returnBook(returnBookDto);
  }
}
