import { RouterModule } from '@angular/router';
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
  imports: [
    MatMenuModule,
    MatButtonModule,
    DomainServicesModule,
    CommonModule,
    RouterModule,
  ],
  providers: [UsersPresenter],
  selector: 'looper-user-menu',
  template: `
    <ng-container *ngIf="authUser$ | async">
      <button mat-button [matMenuTriggerFor]="menu">Menu</button>
      <mat-menu #menu>
        <button mat-menu-item routerLink="/account">Account</button>
        <button mat-menu-item (click)="handleLogout()">Logout</button>
      </mat-menu>
    </ng-container>
  `,
})
export class UserMenuComponent {
  // state -------------------------------------------------------------------------------------------------------------
  public authUser$ = this._presenter.authUser$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _presenter: UsersPresenter) {}

  // api ---------------------------------------------------------------------------------------------------------------

  // event handlers ----------------------------------------------------------------------------------------------------

  public handleLogout() {
    this._presenter.signOut();
  }
}
