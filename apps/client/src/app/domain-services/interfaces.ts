import { DomainServiceLoadableStatus } from './enums';

export interface IDomainServiceLoadable<T, Tempty = null | []> {
  data: T | Tempty;
  status: DomainServiceLoadableStatus;
  /** positive number less than equal to 100 */
  percentage?: number;
}
