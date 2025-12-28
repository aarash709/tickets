import { SetMetadata } from '@nestjs/common';

export const Roles_Key = 'roles';
export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
}

export const Roles = (roles: Role[]) => SetMetadata(Roles_Key, roles);
