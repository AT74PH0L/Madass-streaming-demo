import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  movieId: string;
}
