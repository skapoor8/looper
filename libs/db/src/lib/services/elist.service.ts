import { LoadStrategy, MikroORM, wrap } from '@mikro-orm/core';
import { EntityRepository, SqlEntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ElistEntity, UserEntity } from '../entities';
import {
  IElist,
  IElistWithOwnerInfoDTO,
  IUser,
} from '@gcloud-function-api-auth/interfaces';

@Injectable()
export class ElistService {
  constructor(
    // private readonly mikro: MikroORM,
    // private readonly em: SqlEntityManager,
    @InjectRepository(ElistEntity)
    private readonly er: EntityRepository<ElistEntity>
  ) {}

  public async findAll(): Promise<ElistEntity[]> {
    return await this.er.findAll({
      populate: ['owner'],
      fields: ['*', { owner: ['id', 'firstName', 'lastName'] }],
      // strategy: LoadStrategy.JOINED,
    });
  }

  public async findOne(uuid: string) {
    return await this.er.findOne(uuid, {
      populate: ['owner'],
      fields: ['*', { owner: ['id', 'firstName', 'lastName'] }],
    });
  }

  public async createOne(anElist: Omit<IElist, 'id'>) {
    const entity = this.er.create(new ElistEntity(anElist));
    await this.er.persistAndFlush(entity);
    return entity;
  }

  /** TODO: this is not a replace as it should be
   * how to make it so? delete and add won't work due to cascade
   * maybe by schema?
   */
  public async updateOne(uuid: string, anElist: Omit<IElist, 'id'>) {
    const toUpdate = await this.er.findOneOrFail(uuid);
    wrap(toUpdate).assign(anElist);
    await this.er.persistAndFlush(toUpdate);
  }

  public async deleteOne(uuid: string) {
    const ref = this.er.getReference(uuid);
    await this.er.removeAndFlush(ref);
  }

  public async findByOwnerId(id: string): Promise<ElistEntity[]> {
    return await this.er.find({ owner: { id } });
  }
}
