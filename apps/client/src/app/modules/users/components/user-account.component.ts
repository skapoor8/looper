import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { IUser } from '@gcloud-function-api-auth/interfaces';
import { catchError, throwError } from 'rxjs';
import { UsersDomainService } from '../../../domain-services';
import { DomainServicesModule } from '../../../domain-services';
import { UsersPresenter } from '../presenters/users.presenter';

@Component({
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, DomainServicesModule, CommonModule],
  providers: [UsersPresenter],
  selector: 'looper-user-account',
  template: ` {{ authUser$ | async | json }} `,
})
export class UserAcountComponent {
  // state -------------------------------------------------------------------------------------------------------------
  public authUser$ = this._presenter.authUser$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _presenter: UsersPresenter) {}

  // api ---------------------------------------------------------------------------------------------------------------

  // event handlers ----------------------------------------------------------------------------------------------------
}
