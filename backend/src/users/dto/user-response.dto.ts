import { Role } from '../../auth/role.enum';

export class UserResponse {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  role: Role;
}
