import { DomainServiceUtils } from './../../../shared/utils/domain-service.utils';
import { Injectable } from '@angular/core';
import {
  DomainServiceLoadableStatus,
  ElistsDomainService,
  SubscriptionsDomainService,
} from '../../../domain-services';
import { ISubscriptionNew, IElist } from '@gcloud-function-api-auth/interfaces';
import {
  BehaviorSubject,
  filter,
  map,
  of,
  switchMap,
  tap,
  startWith,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsPresenter {
  private _elistId$ = new BehaviorSubject<string | null>(null);
  public elistId$ = this._elistId$.asObservable();

  // private _elist$ = new BehaviorSubject(
  //   DomainServiceUtils.createIdleLoadable<IElist, null>(null)
  // );
  public elist$ = this._elistId$.pipe(
    switchMap((id) => {
      if (id === null) {
        return of(DomainServiceUtils.createIdleLoadable<IElist, null>(null));
      } else {
        return this._elistsDomainService.getElistById(id).pipe(
          map((elist) =>
            DomainServiceUtils.createCompleteLoadable<IElist, null>(elist)
          ),
          startWith(
            DomainServiceUtils.createEmptyLoadable<IElist, null>(
              DomainServiceLoadableStatus.LOADING,
              null
            )
          )
        );
      }
    })
  );

  constructor(
    private _subscriptionsDomainService: SubscriptionsDomainService,
    private _elistsDomainService: ElistsDomainService
  ) {}

  load(elistId: string, subscriptionId?: string) {
    this._elistId$.next(elistId);
  }

  unload() {
    this._elistId$.next(null);
  }

  public createSubscription(aSub: ISubscriptionNew) {
    return this._subscriptionsDomainService.createSubscription(aSub);
  }
}
