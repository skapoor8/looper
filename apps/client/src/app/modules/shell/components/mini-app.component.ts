import { ShellHeaderComponent } from './header.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FirebaseUIModule } from 'firebaseui-angular';
import {
  DomainServiceLoadableStatus,
  UsersDomainService,
} from '../../../domain-services';
import { map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'looper-shell-mini-app',
  standalone: true,
  imports: [CommonModule, RouterModule, ShellHeaderComponent],
  template: `
    <looper-shell-header></looper-shell-header>
    <h1>mini app component</h1>
    <router-outlet></router-outlet>
  `,
})
export class ShellMiniAppComponent {
  public loadComplete$ = this._usersDomainService.user$.pipe(
    map((l) => l.status === DomainServiceLoadableStatus.COMPLETE)
  );

  constructor(private _usersDomainService: UsersDomainService) {}
}
