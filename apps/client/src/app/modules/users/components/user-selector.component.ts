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
  imports: [MatSelectModule, DomainServicesModule, CommonModule],
  providers: [UsersPresenter],
  selector: 'looper-user-selector',
  template: `
    <mat-form-field class="mb-[-22px]">
      <mat-label>Select User</mat-label>
      <mat-select
        [value]="(user$ | async)?.data"
        (valueChange)="handleSelect($event)"
      >
        <mat-option *ngFor="let u of (users$ | async)?.data" [value]="u">
          {{ u.firstName }} {{ u.lastName }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
})
export class UserSelectorComponent {
  // state -------------------------------------------------------------------------------------------------------------
  public users$ = this._presenter.users$;
  public user$ = this._presenter.user$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _presenter: UsersPresenter) {}

  // api ---------------------------------------------------------------------------------------------------------------

  // event handlers ----------------------------------------------------------------------------------------------------
  public handleSelect(user: IUser) {
    this._presenter.selectUser(user);
  }
}
