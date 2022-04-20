import { IsNotEmpty } from 'class-validator';

export class ReturnBookDto {
  @IsNotEmpty()
  bookId: string;

  @IsNotEmpty()
  userId: string;
  // NOTE: use appropriate validators
}
