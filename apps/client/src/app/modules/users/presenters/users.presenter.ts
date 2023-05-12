import { Injectable } from '@angular/core';
import { IUser } from '@gcloud-function-api-auth/interfaces';
import { UsersDomainService } from '../../../domain-services';

@Injectable()
export class UsersPresenter {
  // state -------------------------------------------------------------------------------------------------------------
  public users$ = this._usersDomainService.users$;
  public user$ = this._usersDomainService.user$;
  public isAdmin$ = this._usersDomainService.isAdmin$;
  public authUser$ = this._usersDomainService.authUser$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _usersDomainService: UsersDomainService) {}

  // api ---------------------------------------------------------------------------------------------------------------
  public selectUser(user: IUser) {
    this._usersDomainService.selectUser(user);
  }

  async signOut() {
    await this._usersDomainService.signOut();
  }
}
