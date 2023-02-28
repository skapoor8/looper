import { RouterModule } from '@angular/router';
import { UserMenuComponent } from './../../users/components/user-menu.component';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserSelectorComponent } from '../../users/components/user-selector.component';

@Component({
  standalone: true,
  imports: [
    MatToolbarModule,
    UserSelectorComponent,
    UserMenuComponent,
    RouterModule,
  ],
  selector: 'looper-shell-header',
  template: `
    <mat-toolbar class="flex-row content-center" color="primary">
      <span class="flex-1 text-white cursor-pointer" routerLink="/">
        looper
      </span>
      <looper-user-menu></looper-user-menu>
    </mat-toolbar>
  `,
  styles: [``],
})
export class ShellHeaderComponent {}
