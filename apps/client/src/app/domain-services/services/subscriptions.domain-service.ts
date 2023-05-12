import { SubscriptionsHttpService } from './../../http-services/subscriptions.http-service';
import { Injectable } from '@angular/core';
import {
  IElist,
  IElistNew,
  ISubscriptionNew,
  ISubscription,
} from '@gcloud-function-api-auth/interfaces';
import { NGXLogger } from 'ngx-logger';
import { catchError, delay, tap, throwError } from 'rxjs';
import { ElistsHttpService, UsersHttpService } from '../../http-services';
import { DomainServiceUtils, ErrorUtils } from '../../shared';
import { DataStore } from '../../stores';
import { DomainServiceLoadableStatus } from '../enums';
import {
  DomainServiceMissingDataError,
  DomainServiceRequestFailedError,
} from '../errors';

@Injectable()
export class SubscriptionsDomainService {
  // state -------------------------------------------------------------------------------------------------------------
  public elistSubscriptions$ = this._dataStore.elistSubscriptions$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _dataStore: DataStore,
    private _usersHttpService: UsersHttpService,
    private _elistsHttpService: ElistsHttpService,
    private _subscriptionsHttpService: SubscriptionsHttpService,
    private _logger: NGXLogger
  ) {}

  // api ---------------------------------------------------------------------------------------------------------------
  public load() {
    return this.getSubscriptionsForElist();
  }

  public unload() {
    this._dataStore.setElistSubscriptions(
      DomainServiceUtils.createIdleLoadable([])
    );
  }

  /**
   * Gets elist for user selected in the DataStore
   *
   * @returns observable list of elists
   *
   * @throws DomainServiceMissingDataError if user was not set in DataStore
   * @throws DomainServiceRequestFailedError (in observable) if request failed
   */
  public getSubscriptionsForElist() {
    const elist = this._dataStore.getElist();
    if (!elist?.data?.id) {
      throw new DomainServiceMissingDataError(
        'elist$ is missing from DataStore'
      );
    }

    this._dataStore.setElistSubscriptions(
      DomainServiceUtils.createEmptyLoadable(
        DomainServiceLoadableStatus.LOADING,
        []
      )
    );
    return this._subscriptionsHttpService
      .getSubscriptionsForElist(elist.data.id)
      .pipe(
        delay(new Date(Date.now() + 800)),
        tap((data) => {
          this._dataStore.setElistSubscriptions(
            DomainServiceUtils.createCompleteLoadable(data)
          );
          this._logger.info(
            'domain-services.subscriptions.getSubscriptionsForElist: subs loaded:',
            data
          );
        }),
        catchError((e) => {
          this._logger.error(
            'domain-services.subscriptions.getSubscriptionsForElist: failed'
          );
          this._dataStore.setUserElists(
            DomainServiceUtils.createEmptyLoadable(
              DomainServiceLoadableStatus.FAILED,
              []
            )
          );
          return throwError(
            () =>
              new DomainServiceRequestFailedError(
                ErrorUtils.chainError('getSubscriptionsForElist failed', e)
              )
          );
        })
      );
  }

  public getSubscriptionById(id: string) {
    return this._subscriptionsHttpService.getSubscriptionById(id);
  }

  public getSubscriptionByEmail(email: string) {
    return this._subscriptionsHttpService.getSubscriptionByEmail(email);
  }

  public createSubscription(aSub: ISubscriptionNew) {
    return this._subscriptionsHttpService.createSubscription(aSub).pipe(
      tap((created) => {
        this._logger.info(
          'domain-services.subscriptions.createSubscription: subscription created',
          created
        );
      }),
      catchError((e) => {
        this._logger.error(
          'domain-services.subscriptions.createSubscription: failed to create subscription'
        );
        return throwError(
          () =>
            new DomainServiceRequestFailedError(
              ErrorUtils.chainError('createSubscription failed', e)
            )
        );
      })
    );
  }

  updateSubscription(aSub: ISubscription) {
    return this._subscriptionsHttpService.updateSubscription(aSub).pipe(
      tap((updated) =>
        this._logger.info(
          'domain-services.subscriptions.updateSubscription: sub updated',
          updated
        )
      ),
      catchError((e) => {
        this._logger.error(
          'domain-services.subscriptions.updateSubscription: failed to update subscription'
        );
        return throwError(
          () =>
            new DomainServiceRequestFailedError(
              ErrorUtils.chainError('updateSubscription failed', e)
            )
        );
      })
    );
  }

  deactivateSubscription(anElist: IElist) {
    return this._elistsHttpService.deleteElist(anElist.id).pipe(
      tap(() =>
        this._logger.info('domain-services.elists.updateElist: elist deleted')
      ),
      catchError((e) => {
        this._logger.error(
          'domain-services.elists.deleteElist: failed to delete elist'
        );
        return throwError(
          () =>
            new DomainServiceRequestFailedError(
              ErrorUtils.chainError('deleteElist failed', e)
            )
        );
      })
    );
  }
}
