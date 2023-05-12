import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserMenuComponent } from './../../users/components/user-menu.component';
import { Component, HostBinding } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserSelectorComponent } from '../../users/components/user-selector.component';
import { map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserSelectorComponent,
    UserMenuComponent,
    MatToolbarModule,
  ],
  selector: 'looper-shell-header',
  template: `
    <mat-toolbar class="flex-row content-center" color="primary">
      <span class="flex-1 text-white cursor-pointer" routerLink="/">
        looper
      </span>
      <looper-user-menu *ngIf="showUserMenu"></looper-user-menu>
    </mat-toolbar>
  `,
  styles: [``],
})
export class ShellHeaderComponent {
  @HostBinding('class')
  _classes = 'fixed top-0 w-screen h-[64px]';

  public showUserMenu = false;

  constructor(private _router: Router) {}

  ngOnInit() {
    // hide user menu for subscriptions routes, and for the elists/:id/subscribe route
    const hideUserMenu =
      this._router.url.indexOf('subscriptions/') !== -1 ||
      this._router.url.indexOf('subscribe') !== -1;
    this.showUserMenu = !hideUserMenu;
  }
}
