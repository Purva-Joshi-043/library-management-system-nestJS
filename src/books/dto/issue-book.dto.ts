import { IsNotEmpty } from "class-validator";

export class IssueBookDto {
  @IsNotEmpty()
  bookId: string;

  @IsNotEmpty()
  userId: string;
  // NOTE: use IsString()
}
