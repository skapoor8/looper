import { LoadStrategy, MikroORM, wrap } from '@mikro-orm/core';
import { EntityRepository, SqlEntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ElistEntity, SubscriptionEntity, UserEntity } from '../entities';
import {
  IElist,
  IElistWithOwnerInfoDTO,
  ISubscription,
  IUser,
} from '@gcloud-function-api-auth/interfaces';

@Injectable()
export class SubscriptionService {
  constructor(
    // private readonly mikro: MikroORM,
    // private readonly em: SqlEntityManager,
    @InjectRepository(SubscriptionEntity)
    private readonly er: EntityRepository<SubscriptionEntity>
  ) {}

  public async findAll(args?: {
    email?: string;
  }): Promise<SubscriptionEntity[]> {
    if (args) {
      const { email } = args;
      return await this.er.find(
        {
          email,
        },
        {
          populate: ['elist'],
          // fields: ['*', 'elist.id', 'elist.elistName'],
          fields: ['*', { elist: ['id', 'elistName'] }],
        }
      );
    } else {
      return await this.er.findAll({
        populate: ['elist'],
        // fields: ['*', 'elist.id', 'elist.elistName'],
        fields: ['*', { elist: ['id', 'elistName'] }],
      });
    }
  }

  public async findOne(uuid: string): Promise<SubscriptionEntity | null> {
    const ent = await this.er.findOne(uuid, {
      populate: ['elist'],
      fields: ['*', 'elist.id', 'elist.elistName'],
    });
    return ent;
  }

  public async createOne(aSub: Omit<ISubscription, 'id'>) {
    const entity = this.er.create(new SubscriptionEntity(aSub));
    await this.er.persistAndFlush(entity);
    return entity;
  }

  /** TODO: this is not a replace as it should be
   * how to make it so? delete and add won't work due to cascade
   * maybe by schema?
   */
  public async updateOne(uuid: string, aSub: Omit<ISubscription, 'id'>) {
    const toUpdate = await this.er.findOneOrFail(uuid);
    wrap(toUpdate).assign({ ...aSub });
    await this.er.flush();
  }

  public async deleteOne(uuid: string) {
    const ref = this.er.getReference(uuid);
    await this.er.removeAndFlush(ref);
  }

  public async findByElistId(id: string): Promise<SubscriptionEntity[]> {
    return await this.er.find({ elist: { id } });
  }
}
