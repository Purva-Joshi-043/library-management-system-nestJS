import { IsEnum, IsOptional } from "class-validator";
import { BookGenre } from "../enum/book-genre-enum";

export class GetBookFilterDto {
  @IsOptional()
  @IsEnum(BookGenre)
  genre?: BookGenre;

  @IsOptional()
  author?: string;
  // NOTE: use IsString()

  @IsOptional()
  title?: string;
}