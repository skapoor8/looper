import { ISubscriptionManagerOverviewVM } from '../interfaces/view-models';
import { DomainServiceUtils } from '../../../shared/utils/domain-service.utils';
import { Injectable } from '@angular/core';
import {
  DomainServiceLoadableStatus,
  ElistsDomainService,
  SubscriptionsDomainService,
} from '../../../domain-services';
import {
  ISubscriptionNew,
  IElist,
  ISubscription,
  ISubscriptionWithElistInfoDTO,
} from '@gcloud-function-api-auth/interfaces';
import {
  BehaviorSubject,
  filter,
  map,
  of,
  switchMap,
  tap,
  startWith,
  shareReplay,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsManagePresenter {
  private _subscriptionId$ = new BehaviorSubject<string | null>(null);
  public subscriptionId$ = this._subscriptionId$.asObservable();

  private _elistId$ = new BehaviorSubject<string | null>(null);
  public elistId$ = this._elistId$.asObservable();

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
    }),
    shareReplay(1)
  );

  public subscription$ = this._subscriptionId$.pipe(
    switchMap((id) => {
      if (id === null) {
        return of(
          DomainServiceUtils.createIdleLoadable<
            ISubscriptionWithElistInfoDTO,
            null
          >(null)
        );
      } else {
        return this._subscriptionsDomainService.getSubscriptionById(id).pipe(
          tap((sub) => this._elistId$.next(sub?.elist?.id)),
          map((sub) =>
            DomainServiceUtils.createCompleteLoadable<
              ISubscriptionWithElistInfoDTO,
              null
            >(sub)
          ),
          startWith(
            DomainServiceUtils.createEmptyLoadable<
              ISubscriptionWithElistInfoDTO,
              null
            >(DomainServiceLoadableStatus.LOADING, null)
          )
        );
      }
    }),
    shareReplay(1)
  );

  public vm$ = this.subscription$.pipe(
    map((sub) =>
      SubscriptionsManagePresenter.buildSubOverviewVM(sub.data ?? undefined)
    )
  );

  static buildSubOverviewVM(
    sub?: ISubscriptionWithElistInfoDTO
  ): ISubscriptionManagerOverviewVM {
    if (sub) {
      return {
        isLoading: false,
        elistName: sub.elist.elistName,
        subscriberName: `${sub.firstName} ${sub.lastName}`,
        isSubscriptionActive: sub.isActive,
      };
    } else {
      return {
        isLoading: true,
        elistName: '',
        subscriberName: '',
        isSubscriptionActive: true,
      };
    }
  }

  constructor(
    private _subscriptionsDomainService: SubscriptionsDomainService,
    private _elistsDomainService: ElistsDomainService
  ) {}

  load(subscriptionId: string) {
    this._subscriptionId$.next(subscriptionId);
  }

  unload() {
    this._elistId$.next(null);
  }

  public updateSubscription(aSub: ISubscription) {
    return this._subscriptionsDomainService
      .updateSubscription(aSub)
      .pipe(
        tap(() => this._subscriptionId$.next(this._subscriptionId$.getValue()))
      );
  }
}
