import {
  DomainServiceLoadableStatus,
  IDomainServiceLoadable,
} from '../../domain-services';

export class DomainServiceUtils {
  static createIdleLoadable<T, Tempty>(
    empty: Tempty
  ): IDomainServiceLoadable<T, Tempty> {
    return {
      data: empty,
      status: DomainServiceLoadableStatus.IDLE,
    };
  }

  static createEmptyLoadable<T, Tempty>(
    status: DomainServiceLoadableStatus,
    empty: Tempty
  ): IDomainServiceLoadable<T, Tempty> {
    return {
      data: empty,
      status,
    };
  }

  static createCompleteLoadable<T, Tempty>(
    data: T
  ): IDomainServiceLoadable<T, Tempty> {
    const loadable: IDomainServiceLoadable<T, Tempty> = {
      data,
      status: DomainServiceLoadableStatus.COMPLETE,
    };
    return loadable;
  }
}
