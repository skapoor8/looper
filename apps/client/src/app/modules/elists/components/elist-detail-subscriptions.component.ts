import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { LooperUIListComponent } from './../../../shared/components/list.component';
import { MatButtonModule } from '@angular/material/button';
import {
  LooperUITabComponent,
  LooperUIPageComponent,
  LooperUITabsComponent,
} from './../../../shared';
import { Component, ViewChild } from '@angular/core';
import { ElistsPresenter } from '../presenters';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'looper-elist-detail-subscriptions',
  imports: [
    CommonModule,
    RouterModule,
    LooperUIPageComponent,
    LooperUITabComponent,
    LooperUITabsComponent,
    LooperUIListComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  template: `
    <looper-ui-page backRoute="../..">
      <ng-container pageActionsLeft>
        <looper-ui-tabs>
          <looper-ui-tab
            icon="groups"
            label="Subscribers"
            route="."
          ></looper-ui-tab>
          <looper-ui-tab
            icon="settings"
            label="Settings"
            route="../settings"
          ></looper-ui-tab>
        </looper-ui-tabs>
      </ng-container>
      <ng-container pageActionsRight>
        <button mat-button [matMenuTriggerFor]="menu">
          Links
          <mat-icon>open_in_new</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <ng-container *ngIf="(elist$ | async)?.data as elist">
            <button
              mat-menu-item
              target="_blank"
              (click)="openUrl(['/', 'elists', elist?.id ?? '', 'subscribe'])"
            >
              Create Subscription
            </button>
            <button
              mat-menu-item
              (click)="
                openUrl(['/', 'subscriptions', 'manage'], {
                  elistId: elist?.id ?? ''
                })
              "
            >
              Manage Subscription
            </button>
          </ng-container>
        </mat-menu>
      </ng-container>
      <div pageMain class="flex flex-col flex-1">
        <looper-ui-list
          class="flex-1"
          [items]="subscriptions$ | async"
          labelField="label"
          editRouteField="editRoute"
          [isLoading]="(subscriptionsLoading$ | async) === 'LOADING'"
          [openInNewTab]="true"
          [disableContextMenu]="true"
        ></looper-ui-list>
      </div>
    </looper-ui-page>
  `,
})
export class ElistDetailSubscriptionsComponent {
  subscriptions$ = this._elistPresenter.subscriptions$;
  subscriptionsLoading$ = this._elistPresenter.subscriptionsLoadStatus$;
  elist$ = this._elistPresenter.selectedElist$;

  constructor(
    private _elistPresenter: ElistsPresenter,
    private _router: Router
  ) {}

  ngOnInit() {
    this._elistPresenter.loadSubscriptions();
  }

  ngOnDestroy() {
    this._elistPresenter.unloadSubscriptions();
  }

  openUrl(fragments: string[], query?: Record<string, string>) {
    const url = this._router.serializeUrl(
      this._router.createUrlTree(fragments, { queryParams: { ...query } })
    );
    window.open(url, '_blank');
  }
}
