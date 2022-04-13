import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';

@Module({
  imports: [TypeOrmModule.forFeature([BooksRepository]), AuthModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
