import { Role } from '../role.enum';

export class LoginResponseDto {
  email: string;
  displayName: string;
  picture: string;
  role: Role;
}
