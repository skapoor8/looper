import {
  Collection,
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  Ref,
  Reference,
  Unique,
  wrap,
} from '@mikro-orm/core';
import { IElist } from '@gcloud-function-api-auth/interfaces';
import { UserEntity } from './user.entity';
import { UuidType } from '../custom-types';
import { parse, v4 } from 'uuid';

@Entity({ tableName: 'elists' })
@Unique({ properties: ['elistName', 'owner'] })
export class ElistEntity implements Omit<IElist, 'ownerId'> {
  @PrimaryKey({ type: UuidType, autoincrement: false })
  public id: string = v4();

  @Property({ fieldName: 'elist_name', length: 255 })
  public elistName!: string;

  @Property({ columnType: 'JSON', nullable: true })
  public settings?: object;

  @Property({
    fieldName: 'default_settings',
    columnType: 'JSON',
    nullable: true,
  })
  public defaultSettings?: object;

  @ManyToOne({
    entity: () => UserEntity,
    ref: true,
    fieldName: 'owner_id',
  })
  owner: IdentifiedReference<UserEntity>;

  constructor(elist: Partial<IElist>) {
    const ownerId = elist.ownerId;

    // wrap owner in ref
    if (ownerId) {
      delete elist.ownerId;
      const bin = Buffer.from(parse(ownerId) as Uint8Array);
      // const binHex = bin.toString('hex');
      // console.log('constructor bin:', binHex, Buffer.from(binHex));
      this.owner = Reference.createFromPK(UserEntity, ownerId);
    }

    Object.assign(this, elist);
  }

  toJSON(...args: any[]): Record<string, any> {
    /** todo: too hacky */
    // const { id, elistName, settings, defaultSettings } = this;

    // const common = {
    //   id,
    //   elistName,
    //   settings,
    //   defaultSettings,
    // };
    // let obj;

    // if (this.owner.isInitialized()) {
    //   obj = {
    //     ...common,
    //     owner: this.owner.toJSON(),
    //   };
    // } else {
    //   obj = {
    //     ...common,
    //     ownerId: this.owner.id,
    //   };
    // }

    const obj: Partial<IElist> & { owner?: UserEntity } = {};
    Object.assign(obj, this);

    /** what happens if there's no owner? */
    if (!this.owner?.isInitialized()) {
      obj.ownerId = this.owner?.id;
      delete obj.owner;
    }

    // from before

    return obj;
  }
}
