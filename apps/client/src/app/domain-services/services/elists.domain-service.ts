import { Injectable } from '@angular/core';
import { IElist, IElistNew } from '@gcloud-function-api-auth/interfaces';
import { NGXLogger } from 'ngx-logger';
import { catchError, delay, take, tap, throwError } from 'rxjs';
import { ElistsHttpService, UsersHttpService } from '../../http-services';
import { DomainServiceUtils, ErrorUtils } from '../../shared';
import { DataStore } from '../../stores';
import { DomainServiceLoadableStatus } from '../enums';
import {
  DomainServiceMissingDataError,
  DomainServiceRequestFailedError,
} from '../errors';

@Injectable()
export class ElistsDomainService {
  // state -------------------------------------------------------------------------------------------------------------
  public userElists$ = this._dataStore.userElists$;
  public selectedElist$ = this._dataStore.elist$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _dataStore: DataStore,
    private _usersHttpService: UsersHttpService,
    private _elistsHttpService: ElistsHttpService,
    private _logger: NGXLogger
  ) {}

  // api ---------------------------------------------------------------------------------------------------------------
  public load() {
    return this.getElistsForUser();
  }

  public unload() {
    this._dataStore.setUserElists(DomainServiceUtils.createIdleLoadable([]));
  }

  public selectElist(id: string) {
    const elists = this._dataStore.getElists()?.data;
    const selected = elists.find((e) => e.id === id);
    if (selected) {
      this._dataStore.setElist(
        DomainServiceUtils.createCompleteLoadable(selected)
      );
    } else {
      throw new Error(`Selecting elist with unloaded id ${id}`);
    }
  }

  public deselectElist() {
    this._dataStore.setElist(DomainServiceUtils.createIdleLoadable(null));
  }

  /**
   * Gets elist for user selected in the DataStore
   *
   * @returns observable list of elists
   *
   * @throws DomainServiceMissingDataError if user was not set in DataStore
   * @throws DomainServiceRequestFailedError (in observable) if request failed
   */
  public getElistsForUser() {
    const user = this._dataStore.getUser();
    if (!user?.data?.id) {
      throw new DomainServiceMissingDataError(
        'user$ is missing from DataStore'
      );
    }

    this._dataStore.setUserElists(
      DomainServiceUtils.createEmptyLoadable(
        DomainServiceLoadableStatus.LOADING,
        []
      )
    );
    return this._usersHttpService.getUserElists(user.data.id).pipe(
      delay(new Date(Date.now() + 800)),
      tap((data) => {
        this._dataStore.setUserElists(
          DomainServiceUtils.createCompleteLoadable(data)
        );
        this._logger.info(
          'domain-services.elists.getElistsForUser: elists loaded:',
          data
        );
      }),
      catchError((e) => {
        this._logger.error(
          'domain-services.elists.getElistsForUser: getElistsForUser failed'
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
              ErrorUtils.chainError('getElistsForUser failed', e)
            )
        );
      }),
      take(1)
    );
  }

  public getElistById(id: string) {
    return this._elistsHttpService.getElistById(id);
  }

  public createElist(anElist: IElistNew) {
    return this._elistsHttpService.createElist(anElist).pipe(
      tap((created) => {
        this._logger.info(
          'domain-services.elists.createElist: elist created',
          created
        );
      }),
      catchError((e) => {
        this._logger.error(
          'domain-services.elists.createElist: failed to create elist'
        );
        return throwError(
          () =>
            new DomainServiceRequestFailedError(
              ErrorUtils.chainError('createElist failed', e)
            )
        );
      })
    );
  }

  updateElist(anElist: IElist) {
    return this._elistsHttpService.updateElist(anElist).pipe(
      tap((updated) =>
        this._logger.info('domain-services.elists.updateElist: elist updated')
      ),
      catchError((e) => {
        this._logger.error(
          'domain-services.elists.updateElist: failed to update elist'
        );
        return throwError(
          () =>
            new DomainServiceRequestFailedError(
              ErrorUtils.chainError('updateElist failed', e)
            )
        );
      })
    );
  }

  deleteElist(anElist: IElist) {
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
