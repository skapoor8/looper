import { UserRole } from '@gcloud-function-api-auth/interfaces';
import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'ROLE';
export const Role = (role: UserRole) => SetMetadata(ROLE_KEY, role);
