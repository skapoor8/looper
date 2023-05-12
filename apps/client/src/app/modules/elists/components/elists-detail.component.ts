import { filter, take } from 'rxjs';
import { SubscriptionsPresenter } from './../presenters/subscriptions.presenter';
import { LooperUITabsComponent, LooperUITabComponent } from './../../../shared';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LooperUIPageComponent } from './../../../shared';
import { Component, HostBinding } from '@angular/core';
import {
  DomainServiceLoadableStatus,
  ElistsDomainService,
} from '../../../domain-services';
import { ElistsPresenter } from '../presenters';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    LooperUIPageComponent,
    RouterModule,
    CommonModule,
    MatButtonModule,
    LooperUITabsComponent,
    LooperUITabComponent,
  ],
  selector: 'looper-elists-detail',
  template: `
    <router-outlet *ngIf="(loadStatus$ | async) === 'COMPLETE'"></router-outlet>
  `,
})
export class ElistDetailComponent {
  @HostBinding('class')
  public classes = 'flex flex-1 flex-col';

  public loadStatus$ = this._presenter.elistLoadStatus$;

  constructor(
    private _presenter: ElistsPresenter,
    private _subsPresenter: SubscriptionsPresenter,
    private _activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this._activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.loadStatus$
        .pipe(
          filter((s) => s === DomainServiceLoadableStatus.COMPLETE),
          take(1)
        )
        .subscribe({
          next: () => {
            this._presenter.loadElist(id);
          },
        });
    }
  }

  ngOnDestroy() {
    this._presenter.unloadElist();
    this._subsPresenter.unload();
  }
}
