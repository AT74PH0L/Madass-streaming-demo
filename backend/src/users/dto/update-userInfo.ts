import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserInfo {
  @IsString()
  @IsOptional()
  @Matches(/\S/, { message: 'username must not be empty or whitespace' })
  displayName: string;

  @IsString()
  @IsOptional()
  picture: string;
}
