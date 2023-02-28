import { MikroORM, wrap } from '@mikro-orm/core';
import { EntityRepository, SqlEntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserEntity } from '../entities';
import { IUser } from '@gcloud-function-api-auth/interfaces';

@Injectable()
export class UserService {
  constructor(
    // private readonly mikro: MikroORM,
    // private readonly em: SqlEntityManager,
    @InjectRepository(UserEntity)
    private readonly er: EntityRepository<UserEntity>
  ) {}

  public async findAll() {
    return await this.er.findAll();
  }

  public async findOne(uuid: string) {
    return await this.er.findOne(uuid);
  }

  public async findOneByUid(uid: string) {
    return await this.er.findOne({ uid });
  }

  public async createOne(aUser: Omit<IUser, 'id'>) {
    const entity = this.er.create(new UserEntity(aUser));
    await this.er.persistAndFlush(entity);
  }

  /** TODO: this is not a replace as it should be
   * how to make it so? delete and add won't work due to cascade
   * maybe by schema?
   */
  public async updateOne(uuid: string, aUser: Omit<IUser, 'id'>) {
    const toUpdate = await this.er.findOneOrFail(uuid);
    wrap(toUpdate).assign(aUser);
    await this.er.persistAndFlush(toUpdate);
  }

  public async deleteOne(uuid: string) {
    const ref = this.er.getReference(uuid);
    await this.er.removeAndFlush(ref);
  }
}
