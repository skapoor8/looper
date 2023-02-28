import { IElist, IUser } from '../domain';

export interface IElistWithOwnerInfoDTO extends Omit<IElist, 'ownerId'> {
  owner: Pick<IUser, 'id' | 'firstName' | 'lastName'>;
}
