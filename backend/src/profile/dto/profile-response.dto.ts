import { Role } from '../../auth/role.enum';

export class ProfileResponse {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  role: Role;
}
