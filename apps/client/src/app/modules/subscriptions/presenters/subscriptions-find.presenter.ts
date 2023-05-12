import {
  ISubscriptionFindVM,
  ISubscriptionManagerOverviewVM,
} from '../interfaces/view-models';
import { DomainServiceUtils } from '../../../shared/utils/domain-service.utils';
import { Injectable } from '@angular/core';
import {
  DomainServiceLoadableStatus,
  ElistsDomainService,
  IDomainServiceLoadable,
  SubscriptionsDomainService,
} from '../../../domain-services';
import {
  ISubscriptionNew,
  IElist,
  ISubscription,
  ISubscriptionWithElistInfoDTO,
  IElistWithOwnerInfoDTO,
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
  combineLatestWith,
  catchError,
  take,
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsFindPresenter {
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
          ),
          catchError((e) => {
            console.error('SubscriptionsFindPresenter.elist$:', e);
            return of(
              DomainServiceUtils.createEmptyLoadable<IElist, null>(
                DomainServiceLoadableStatus.FAILED,
                null
              )
            );
          })
        );
      }
    }),
    shareReplay(1)
  );

  private _emailId$ = new BehaviorSubject<string | null>(null);
  public subscription$ = this._emailId$.pipe(
    switchMap((email) => {
      if (email === null) {
        return of(
          DomainServiceUtils.createIdleLoadable<
            ISubscriptionWithElistInfoDTO,
            null
          >(null)
        );
      } else {
        return this._subscriptionsDomainService
          .getSubscriptionByEmail(email)
          .pipe(
            map((subs) => {
              const found = subs.find(
                (s) => s.elist.id === this._elistId$.getValue()
              );
              if (found) {
                return DomainServiceUtils.createCompleteLoadable<
                  ISubscriptionWithElistInfoDTO,
                  null
                >(found);
              } else {
                return DomainServiceUtils.createEmptyLoadable<
                  ISubscriptionWithElistInfoDTO,
                  null
                >(DomainServiceLoadableStatus.FAILED, null);
              }
            }),
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
    combineLatestWith(this.elist$),
    map(([sub, elist]) =>
      SubscriptionsFindPresenter.buildSubOverviewVM(elist, sub)
    )
  );

  static buildSubOverviewVM(
    elist?: IDomainServiceLoadable<IElist, null>,
    sub?: IDomainServiceLoadable<ISubscriptionWithElistInfoDTO, null>
  ): ISubscriptionFindVM {
    const vm = {
      elistName: elist?.data?.elistName ?? '',
      elistId: elist?.data?.id ?? '',
      email: sub?.data?.email ?? '',
      elistFound: elist?.status ?? DomainServiceLoadableStatus.IDLE,
      subscriptionFound: sub?.status ?? DomainServiceLoadableStatus.IDLE,
    };
    return vm;
  }

  constructor(
    private _subscriptionsDomainService: SubscriptionsDomainService,
    private _elistsDomainService: ElistsDomainService,
    private _router: Router
  ) {}

  load(elistId: string) {
    this._elistId$.next(elistId);
  }

  unload() {
    this._elistId$.next(null);
  }

  findSubscription(email: string) {
    this._emailId$.next(email);
    this.subscription$
      .pipe(
        filter((s) => s.status === DomainServiceLoadableStatus.COMPLETE),
        take(1)
      )
      .subscribe({
        next: async (loadable) => {
          await this._router.navigate(['subscriptions', loadable.data?.id]);
        },
      });
  }
}
