import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';

@Module({
  imports: [TypeOrmModule.forFeature([BooksRepository]), UserModule, PassportModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
