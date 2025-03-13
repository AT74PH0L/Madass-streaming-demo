import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  pathImg: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  userId: string;
}
