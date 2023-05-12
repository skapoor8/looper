import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  IElist,
  ISubscription,
  IUser,
} from '@gcloud-function-api-auth/interfaces';
import { IDomainServiceLoadable } from '../domain-services';
import { DomainServiceUtils } from '../shared';

@Injectable({
  providedIn: 'root',
})
export class DataStore {
  // state ---------------------------------------------------------------------

  /** all users */
  private _users$ = new BehaviorSubject<IDomainServiceLoadable<IUser[], []>>(
    DomainServiceUtils.createIdleLoadable([])
  );
  /** all users (observable) */
  public readonly users$ = this._users$.asObservable();

  /** selected user */
  private _user$ = new BehaviorSubject<IDomainServiceLoadable<IUser, null>>(
    DomainServiceUtils.createIdleLoadable(null)
  );
  /** selected user (observable) */
  public readonly user$ = this._user$.asObservable();

  /** user's elists */
  private _userElists$ = new BehaviorSubject<
    IDomainServiceLoadable<IElist[], []>
  >(DomainServiceUtils.createIdleLoadable([]));
  /** user's elists (observable) */
  public userElists$ = this._userElists$.asObservable();

  private _elist$ = new BehaviorSubject<IDomainServiceLoadable<IElist, null>>(
    DomainServiceUtils.createIdleLoadable(null)
  );
  public elist$ = this._elist$.asObservable();

  private _elistSubscriptions$ = new BehaviorSubject<
    IDomainServiceLoadable<ISubscription[], []>
  >(DomainServiceUtils.createIdleLoadable([]));
  public elistSubscriptions$ = this._elistSubscriptions$.asObservable();

  // setters -------------------------------------------------------------------

  public setUsers(users: IDomainServiceLoadable<IUser[], []>) {
    this._users$.next(users);
  }

  public setUser(user: IDomainServiceLoadable<IUser, null>) {
    this._user$.next(user);
  }

  public setUserElists(elists: IDomainServiceLoadable<IElist[], []>) {
    this._userElists$.next(elists);
  }

  public setElist(elist: IDomainServiceLoadable<IElist, null>) {
    this._elist$.next(elist);
  }

  public setElistSubscriptions(
    subs: IDomainServiceLoadable<ISubscription[], []>
  ) {
    this._elistSubscriptions$.next(subs);
  }

  // getters -------------------------------------------------------------------

  public getUsers() {
    return this._users$.getValue();
  }

  public getUser() {
    return this._user$.getValue();
  }

  public getElists() {
    return this._userElists$.getValue();
  }

  public getElist() {
    return this._elist$.getValue();
  }

  public getElistSubscriptions() {
    return this._elistSubscriptions$.getValue();
  }
}
