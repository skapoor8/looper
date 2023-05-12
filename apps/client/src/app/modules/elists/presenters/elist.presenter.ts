import {
  IElistListItem,
  ISubscriptionListItem,
} from './../interfaces/view-models';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  IElist,
  IElistNew,
  ISubscription,
  ISubscriptionNew,
} from '@gcloud-function-api-auth/interfaces';
import { NGXLogger } from 'ngx-logger';
import {
  BehaviorSubject,
  catchError,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import {
  ElistsDomainService,
  SubscriptionsDomainService,
  UsersDomainService,
} from '../../../domain-services';
import { ErrorUtils } from '../../../shared';
import { ElistFormMode } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ElistsPresenter {
  // state -------------------------------------------------------------------------------------------------------------
  public readonly selectedElist$ = this._elistsDomainService.selectedElist$;
  public readonly elistLoadStatus$ = this._elistsDomainService.userElists$.pipe(
    map((l) => l.status)
  );
  public readonly subscriptionsLoadStatus$ =
    this._subscriptionsDomainService.elistSubscriptions$.pipe(
      map((loadable) => loadable.status)
    );
  public items$ = this._elistsDomainService.userElists$.pipe(
    map((elists) => ElistsPresenter.buildElistViewModel(elists?.data ?? [])),
    shareReplay(1)
  );
  public readonly user$ = this._usersDomainService.user$;
  public subscriptions$ =
    this._subscriptionsDomainService.elistSubscriptions$.pipe(
      map((subs) =>
        ElistsPresenter.buildSubscriptionsViewModel(subs?.data ?? [])
      ),
      shareReplay(1)
    );

  private _mode$ = new BehaviorSubject<ElistFormMode>(ElistFormMode.CREATE);
  public mode$ = this._mode$.asObservable();

  // build view model
  static buildElistViewModel(elists: IElist[] = []): IElistListItem[] {
    return elists.map((e) => {
      return {
        label: e.elistName,
        id: e.id,
        editRoute: `/elists/${e.id}`,
      };
    });
  }

  static buildSubscriptionsViewModel(
    subs: ISubscription[] = []
  ): ISubscriptionListItem[] {
    return subs.map((s) => {
      return {
        label: `${s.firstName} ${s.lastName ?? ''}`,
        id: s.id,
        editRoute: `/subscriptions/${s.id}`,
      };
    });
  }

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _logger: NGXLogger,
    private _elistsDomainService: ElistsDomainService,
    private _usersDomainService: UsersDomainService,
    private _subscriptionsDomainService: SubscriptionsDomainService,
    private _router: Router
  ) {}

  // api ---------------------------------------------------------------------------------------------------------------

  public loadElists() {
    this._elistsDomainService
      .load()
      // .pipe(take(1))
      .subscribe();
  }

  public loadElist(elistId: string) {
    if (elistId) {
      this._elistsDomainService.selectElist(elistId);
    }
  }

  public unloadElist() {
    this._elistsDomainService.deselectElist();
  }

  public setMode(mode: ElistFormMode) {
    this._mode$.next(mode);
  }

  public loadSubscriptions() {
    this._subscriptionsDomainService.load().subscribe();
  }

  public unloadSubscriptions() {
    this._subscriptionsDomainService.unload();
  }

  public createElist(anElist: IElistNew) {
    // this._elistsDomainService.createElist(anElist).subscribe({
    //   next: () => {
    //     try {
    //       this._elistsDomainService.getElistsForUser().subscribe({
    //         next: async () => {
    //           await this._router.navigateByUrl('/elists');
    //         },
    //         error: (e) => {
    //           this._logger.error(
    //             ErrorUtils.chainError(
    //               'created elist but could not refresh list index',
    //               e as Error
    //             )
    //           );
    //         },
    //       });
    //     } catch (e) {
    //       this._logger.error(
    //         ErrorUtils.chainError(
    //           'created elist but could not refresh list index',
    //           e as Error
    //         )
    //       );
    //     }
    //   },
    //   error: (e) => {
    //     this._logger.error(ErrorUtils.chainError('failed to create elist', e));
    //     // todo: add notificartion
    //   },
    // });

    return this._elistsDomainService.createElist(anElist).pipe(
      switchMap(() => {
        return this._elistsDomainService.getElistsForUser().pipe(
          tap(async () => await this._router.navigateByUrl('/elists')),
          catchError((e) => {
            this._logger.error(
              ErrorUtils.chainError(
                'created elist but could not refresh list index',
                e
              )
            );
            return throwError(() => e);
          })
        );
      }),
      catchError((e) => {
        this._logger.error(ErrorUtils.chainError('failed to create elist', e));
        return throwError(() => e);
      })
    );
  }

  public updateElist(anElist: IElist) {
    return this._elistsDomainService.updateElist(anElist).pipe(
      catchError((e) => {
        this._logger.error(ErrorUtils.chainError('failed to update elist', e));
        return throwError(() => e);
      })
    );
  }

  public deleteElist(anElist: IElist) {
    return this._elistsDomainService.deleteElist(anElist).pipe(
      switchMap(() => {
        return this._elistsDomainService.getElistsForUser().pipe(
          catchError((e) => {
            this._logger.error(
              ErrorUtils.chainError(
                'deleted elist but could not refresh list index',
                e
              )
            );
            return throwError(() => e);
          })
        );
      }),
      catchError((e) => {
        this._logger.error(ErrorUtils.chainError('failed to delete elist', e));
        return throwError(() => e);
      })
    );
  }
}
