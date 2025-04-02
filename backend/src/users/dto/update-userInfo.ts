import { IsOptional, IsString } from 'class-validator';

export class UpdateUserInfo {
  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  @IsOptional()
  picture: string;
}
