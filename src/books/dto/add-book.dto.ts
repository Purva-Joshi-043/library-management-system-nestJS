import { IsEnum, IsNotEmpty } from "class-validator";
import { BookGenre } from "../enum/book-genre-enum";

export class AddBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  @IsEnum(BookGenre)
  genre: BookGenre;
}