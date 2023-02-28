import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  Ref,
  Unique,
} from '@mikro-orm/core';
import { ISubscription } from '@gcloud-function-api-auth/interfaces';
import { ElistEntity } from './elist.entity';
import { UuidType } from '../custom-types';
import { v4 } from 'uuid';

@Entity({ tableName: 'subscriptions' })
@Unique({ properties: ['email', 'elist'] })
export class SubscriptionEntity implements Omit<ISubscription, 'elistId'> {
  @PrimaryKey({ type: UuidType, autoincrement: false })
  public id: string = v4();

  @Property({ fieldName: 'first_name', length: 100 })
  public firstName?: string;

  @Property({ fieldName: 'last_name', length: 100 })
  public lastName?: string;

  @Property({ fieldName: 'company' })
  public company?: string;

  @Property({ nullable: false })
  public email!: string;

  @Property({ fieldName: 'phone_number', length: 10 })
  public phoneNumber?: string;

  @Property({ fieldName: 'phone_country_code', length: 10 })
  public phoneCountryCode?: string;

  @Property({ fieldName: 'user_did_consent', columnType: 'BOOLEAN' })
  public userDidConsent = false;

  @Property({ columnType: 'JSON' })
  public settings?: object;

  @ManyToOne({
    entity: () => ElistEntity,
    ref: true,
    fieldName: 'elist_id',
    // wrappedReference: true,
  })
  public elist: Ref<ElistEntity>;

  constructor(sub: Partial<ISubscription>) {
    const elistId = sub.elistId;

    if (elistId) {
      delete sub.elistId;
      this.elist = ref(ElistEntity, elistId);
    }

    Object.assign(this, sub);
  }

  toJSON(...args: any[]): Record<string, any> {
    const obj: Partial<ISubscription> & { elist?: ElistEntity } = {};
    Object.assign(obj, this);

    if (!this.elist?.isInitialized()) {
      obj.elistId = this.elist.id;
      delete obj.elist;
    }

    return obj;
  }
}
