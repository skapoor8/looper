import { UserRole } from '@gcloud-function-api-auth/interfaces';
import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { IUser } from '@gcloud-function-api-auth/interfaces';
import { UuidType } from '../custom-types';
import { v4 } from 'uuid';

@Entity({ tableName: 'users' })
export class UserEntity implements IUser {
  @PrimaryKey({ type: UuidType, autoincrement: false })
  public id: string = v4(); // auto-generate uuid

  @Property()
  @Unique()
  @Index()
  public uid: string;

  @Property({ fieldName: 'first_name', length: 100, nullable: true })
  public firstName?: string;

  @Property({ fieldName: 'last_name', length: 100, nullable: true })
  public lastName?: string;

  @Property({ fieldName: 'phone_number', length: 20, nullable: true })
  public phoneNumber?: string;

  @Property({ fieldName: 'phone_country_code', length: 10, nullable: true })
  public countryCode?: string;

  @Property({ length: 255 })
  @Unique()
  @Index()
  public email: string;

  @Enum(() => UserRole)
  public role: UserRole = UserRole.USER;

  constructor(user: Partial<IUser>) {
    Object.assign(this, user);
  }

  // static --------------------------------------------------------------------
}
