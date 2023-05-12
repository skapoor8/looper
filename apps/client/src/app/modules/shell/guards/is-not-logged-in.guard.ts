import { DomainServiceLoadableStatus } from './../../../domain-services/enums';
import { routes } from './../../subscriptions/subscriptions.routes';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  combineLatestWith,
  filter,
  firstValueFrom,
  map,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { UsersDomainService } from '../../../domain-services';

@Injectable()
export class IsNotLoggedInGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _auth: AngularFireAuth,
    private _usersDomainService: UsersDomainService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const { isPublic } = route.data;
    return this._auth.user.pipe(
      map((firebaseUser) => {
        if (firebaseUser) {
          this._router.navigateByUrl('/elists');
        }
        return !firebaseUser;
        // && appUser?.status === DomainServiceLoadableStatus.COMPLETE
      })
    );
  }
}
