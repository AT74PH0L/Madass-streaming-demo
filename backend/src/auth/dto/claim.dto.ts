import { Role } from '../role.enum';

export class Claim {
  sub: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  role: Role;
}
