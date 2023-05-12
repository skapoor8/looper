import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { ElistsPresenter } from '../presenters';
import { CommonModule } from '@angular/common';
import { map, filter, take } from 'rxjs';
import { DomainServiceLoadableStatus } from '../../../domain-services';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'looper-elist-mini-app',
  template: `<router-outlet *ngIf="loadComplete$ | async"></router-outlet>`,
})
export class ElistMiniAppComponent {
  loadComplete$ = this._presenter.user$.pipe(
    map((s) => s.status === DomainServiceLoadableStatus.COMPLETE)
  );

  constructor(private _presenter: ElistsPresenter) {}

  ngOnInit() {
    console.log('ElistsMiniAppComponent.onInit!');
    this._presenter.user$
      .pipe(
        filter((u) => u.status === DomainServiceLoadableStatus.COMPLETE),
        take(1)
      )
      .subscribe({
        next: () => this._presenter.loadElists(),
      });
  }
}
