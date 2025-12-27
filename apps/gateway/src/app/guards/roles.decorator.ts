import { SetMetadata } from '@nestjs/common';

export const Roles_Key = 'roles';
export enum Role {
  User = 'user',
  Admin = 'admin',
  Moderator = 'moderator',
}

export const Roles = (roles: Role[]) => SetMetadata(Roles_Key, roles);
