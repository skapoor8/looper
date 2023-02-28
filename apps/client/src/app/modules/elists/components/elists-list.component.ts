import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DomainServiceLoadableStatus } from '../../../domain-services';
import { ElistsPresenter } from '../presenters';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { LooperUIContextMenuComponent } from '../../../shared';
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
    LooperUIContextMenuComponent,
  ],
  providers: [ElistsPresenter],
  selector: 'looper-elists-list',
  template: `
    <!-- title + actions -->
    <div class="flex flex-row items-center pb-3 border-b">
      <span class="uppercase font-semibold flex-1 text-gray-500"
        >My Elists</span
      >
      <button mat-raised-button color="primary" [routerLink]="['create']">
        New
      </button>
    </div>

    <!-- loading content -->
    <div
      *ngIf="
        (userElists$ | async)?.status ===
        DomainServiceLoadableStatusEnum.LOADING
      "
      class="flex flex-col flex-1 items-center"
    >
      <mat-spinner class="flex-1"></mat-spinner>
    </div>

    <!-- loaded list -->
    <ng-container
      *ngIf="
        (userElists$ | async)?.status ===
        DomainServiceLoadableStatusEnum.COMPLETE
      "
    >
      <div
        *ngFor="let e of (userElists$ | async)?.data"
        [routerLink]="[e.id, 'edit']"
        class="w-full p-3 bg-white rounded hover:border hover:border-matDeepPurple-400"
        (contextmenu)="handleContextMenu($event, e)"
      >
        {{ e.elistName }}
      </div>
    </ng-container>

    <!-- shared context menu for edit / delete -->
    <looper-ui-context-menu #menu>
      <button
        mat-menu-item
        [routerLink]="'/elists/' + menu.contextData?.id + '/edit'"
      >
        <mat-icon>edit</mat-icon>
        <span>Edit</span>
      </button>
      <button
        mat-menu-item
        class="flex items-center"
        (click)="handleDeleteElist(menu.contextData)"
      >
        <mat-icon [ngStyle]="{ color: 'rgba(244, 64, 52)' }">delete</mat-icon>
        <span class="mr-2 text-matRed-500">Delete</span>
      </button>
    </looper-ui-context-menu>
  `,
  host: {
    class: 'flex flex-col items-stretch flex-1 gap-2 w-full p-4 bg-slate-100',
  },
})
export class ElistListComponent {
  @ViewChild(LooperUIContextMenuComponent) menu: LooperUIContextMenuComponent;

  public userElists$ = this._presenter.userElists$;
  public DomainServiceLoadableStatusEnum = DomainServiceLoadableStatus;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _presenter: ElistsPresenter) {}

  // event handlers ----------------------------------------------------------------------------------------------------
  handleContextMenu(e: MouseEvent, data: IElist) {
    e.preventDefault();
    this.menu.toggle(e, data);
  }

  handleDeleteElist(data: IElist) {
    this._presenter.deleteElist(data);
  }
}
