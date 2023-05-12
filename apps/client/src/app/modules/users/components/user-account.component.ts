import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersPresenter } from '../presenters/users.presenter';
import { LooperUIPageComponent } from '../../../shared';

@Component({
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    LooperUIPageComponent,
  ],
  providers: [UsersPresenter],
  selector: 'looper-user-account',
  template: `
    <looper-ui-page [hideActions]="true">
      <div pageMain>
        {{ authUser$ | async | json }}
      </div>
    </looper-ui-page>
  `,
})
export class UserAcountComponent {
  // state -------------------------------------------------------------------------------------------------------------
  public authUser$ = this._presenter.authUser$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _presenter: UsersPresenter) {}

  // api ---------------------------------------------------------------------------------------------------------------

  // event handlers ----------------------------------------------------------------------------------------------------
}
