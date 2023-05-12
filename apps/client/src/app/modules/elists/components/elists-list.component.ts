import { LooperUIListComponent } from './../../../shared/components/list.component';
import { LooperUIPageComponent } from './../../../shared/components/page.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomainServiceLoadableStatus } from '../../../domain-services';
import { ElistsPresenter } from '../presenters';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import {
  LooperUIContextMenuComponent,
  NotificationsService,
  NotificationsServiceModule,
} from '../../../shared';
import { MatIconModule } from '@angular/material/icon';
import { IElist } from '@gcloud-function-api-auth/interfaces';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    NotificationsServiceModule,
    LooperUIContextMenuComponent,
    LooperUIPageComponent,
    LooperUIListComponent,
  ],
  providers: [ElistsPresenter],
  selector: 'looper-elists-list',
  template: `
    <looper-ui-page title="My Elists" [showBackButton]="false">
      <ng-container pageActionsRight>
        <button mat-raised-button color="primary" [routerLink]="['create']">
          NEW
        </button>
      </ng-container>
      <div pageMain class="flex flex-col flex-1">
        <looper-ui-list
          class="flex-1"
          [items]="items$ | async"
          labelField="label"
          [isLoading]="
            (loadStatus$ | async) === DomainServiceLoadableStatusEnum.LOADING
          "
          editRouteField="id"
          (delete)="handleDeleteElist($event)"
        ></looper-ui-list>
      </div>
    </looper-ui-page>
  `,
  host: {
    class: 'flex flex-col items-stretch flex-1 gap-2 w-full bg-slate-100',
  },
})
export class ElistListComponent {
  @ViewChild(LooperUIContextMenuComponent) menu: LooperUIContextMenuComponent;

  public items$ = this._presenter.items$;
  public loadStatus$ = this._presenter.elistLoadStatus$;
  public DomainServiceLoadableStatusEnum = DomainServiceLoadableStatus;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _presenter: ElistsPresenter,
    private _notifications: NotificationsService
  ) {}

  // event handlers ----------------------------------------------------------------------------------------------------
  handleContextMenu(e: MouseEvent, data: IElist) {
    e.preventDefault();
    this.menu.toggle(e, data);
  }

  handleDeleteElist(data: IElist) {
    this._presenter.deleteElist(data).subscribe({
      next: () => this._notifications.success('Elist was deleted'),
      error: () => this._notifications.error('Elist could not be deleted'),
    });
  }
}
