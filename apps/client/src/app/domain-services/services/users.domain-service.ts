import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { IUser } from '@gcloud-function-api-auth/interfaces';
import { NGXLogger } from 'ngx-logger';
import { catchError, defer, from, of, tap, throwError } from 'rxjs';
import { UsersHttpService } from '../../http-services/users.http-service';
import { DomainServiceUtils, ErrorUtils } from '../../shared';
import { DataStore } from '../../stores';
import { DomainServiceLoadableStatus } from '../enums';
import {
  DomainServiceInvalidSelectionError,
  DomainServiceRequestFailedError,
} from '../errors';

@Injectable()
export class UsersDomainService {
  // state -------------------------------------------------------------------------------------------------------------
  public users$ = this._dataStore.users$;
  public user$ = this._dataStore.user$;
  public authUser$ = this._auth.user;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _usersHttpService: UsersHttpService,
    private _dataStore: DataStore,
    private _auth: AngularFireAuth,
    private _logger: NGXLogger
  ) {}

  // api ---------------------------------------------------------------------------------------------------------------
  public load(isAdmin: boolean, id: string) {
    return defer(() => {
      if (isAdmin) {
        return this.getUsers(id);
      } else {
        return this.getUserById(id);
      }
    });
  }

  public unload() {
    this._dataStore.setUsers(DomainServiceUtils.createIdleLoadable([]));
    this._dataStore.setUser(DomainServiceUtils.createIdleLoadable(null));
  }

  /**
   * Get list of users from the backend
   *
   * @returns an observable that emits an array of IUser objects once the internal
   * request completes
   *
   * @throws DomainServiceRequestFailedError (in observable) if request fails
   */
  public getUsers(id: string) {
    return defer(() => {
      this._dataStore.setUsers(
        DomainServiceUtils.createEmptyLoadable(
          DomainServiceLoadableStatus.LOADING,
          []
        )
      );
      return this._usersHttpService.getUsers().pipe(
        tap((data) => {
          this._logger.info('domain-services.users.getUsers:', data);
          this._dataStore.setUsers(
            DomainServiceUtils.createCompleteLoadable(data ?? [])
          );
          // todo select user should not be used period
          this._logger.info('looking for id', id);
          const found = data.find((d) => d.id === id);
          if (found) {
            this.selectUser(found);
          }
        }),
        catchError((e) => {
          this._logger.error('domain-services.users.getUsers:', e);
          this._dataStore.setUsers(
            DomainServiceUtils.createEmptyLoadable(
              DomainServiceLoadableStatus.FAILED,
              []
            )
          );
          return throwError(
            () =>
              new DomainServiceRequestFailedError(
                ErrorUtils.chainError('getUsers failed', e)
              )
          );
        })
      );
    });
  }

  public getUserById(id: string) {
    return defer(() => {
      this._dataStore.setUsers(
        DomainServiceUtils.createEmptyLoadable(
          DomainServiceLoadableStatus.LOADING,
          []
        )
      );
      return this._usersHttpService.getUserById(id).pipe(
        tap((data) => {
          this._logger.info('domain-services.users.getUserByUid:', data);
          this._dataStore.setUsers(
            DomainServiceUtils.createCompleteLoadable([data])
          );
          // todo select user should not be used period
          this.selectUser(data);
        }),
        catchError((e) => {
          this._logger.error('domain-services.users.getUserByUid:', e);
          this._dataStore.setUsers(
            DomainServiceUtils.createEmptyLoadable(
              DomainServiceLoadableStatus.FAILED,
              []
            )
          );
          return throwError(
            () =>
              new DomainServiceRequestFailedError(
                ErrorUtils.chainError('getUserByUid failed', e)
              )
          );
        })
      );
    });
  }

  /**
   * Select a user
   *
   * @throws DomainServiceInvalidSelectionError if choice is invalid
   */
  public selectUser(user: IUser) {
    this._dataStore.setUser(
      DomainServiceUtils.createEmptyLoadable(
        DomainServiceLoadableStatus.LOADING,
        null
      )
    );
    const users = this._dataStore.getUsers();
    const found = users?.data?.find((u) => u === user);
    if (users?.data?.length > 0 && found) {
      this._dataStore.setUser(DomainServiceUtils.createCompleteLoadable(found));
      this._logger.debug(
        'domain-services.users.selectUser: user selected =',
        found
      );
    } else {
      this._dataStore.setUser(
        DomainServiceUtils.createEmptyLoadable(
          DomainServiceLoadableStatus.FAILED,
          null
        )
      );
      throw new DomainServiceInvalidSelectionError(
        'Selecting a user not in DataStore.users$'
      );
    }
  }

  async signOut() {
    await this._auth.signOut();
  }
}
