import { IElist, ISubscription } from '../domain';

export interface ISubscriptionWithElistInfoDTO
  extends Omit<ISubscription, 'elistId'> {
  elist: Pick<IElist, 'id' | 'elistName'>;
}
