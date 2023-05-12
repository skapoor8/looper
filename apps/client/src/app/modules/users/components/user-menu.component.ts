import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { IUser } from '@gcloud-function-api-auth/interfaces';
import { catchError, throwError } from 'rxjs';
import { UsersDomainService } from '../../../domain-services';
import { UsersPresenter } from '../presenters/users.presenter';

@Component({
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterModule,
  ],
  providers: [UsersPresenter],
  selector: 'looper-user-menu',
  template: `
    <ng-container *ngIf="authUser$ | async">
      <button
        mat-icon-button
        color="primary"
        class="hover:bg-matDeepPurple-400"
        [matMenuTriggerFor]="menu"
      >
        <mat-icon class="text-white">person</mat-icon>
      </button>
      <mat-menu #menu>
        <button *ngIf="isAdmin$ | async" mat-menu-item routerLink="/account">
          Account
        </button>
        <button mat-menu-item (click)="handleLogout()">Logout</button>
      </mat-menu>
    </ng-container>
  `,
})
export class UserMenuComponent {
  // state -------------------------------------------------------------------------------------------------------------
  public authUser$ = this._presenter.authUser$;
  public isAdmin$ = this._presenter.isAdmin$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _presenter: UsersPresenter, private _router: Router) {}

  // api ---------------------------------------------------------------------------------------------------------------

  // event handlers ----------------------------------------------------------------------------------------------------

  public async handleLogout() {
    await this._presenter.signOut();
    this._router.navigateByUrl('/login');
  }
}
