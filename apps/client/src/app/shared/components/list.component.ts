import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LooperUIContextMenuComponent } from './context-menu.component';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'looper-ui-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    LooperUIContextMenuComponent,
  ],
  template: `
    <div
      *ngIf="!openInNewTab"
      [routerLink]="[item[editRouteField]]"
      class="w-full p-3 bg-white rounded hover:border hover:border-matDeepPurple-400"
      (contextmenu)="handleContextMenu($event)"
    >
      {{ item[labelField] }}
    </div>

    <div
      *ngIf="openInNewTab"
      class="w-full p-3 bg-white rounded hover:border hover:border-matDeepPurple-400"
      (click)="handleOpenInNewTab()"
      (contextmenu)="handleContextMenu($event)"
    >
      {{ item[labelField] }}
    </div>

    <looper-ui-context-menu #menu>
      <button
        mat-menu-item
        [routerLink]="item[editRouteField]"
        (click)="handleEdit()"
      >
        <mat-icon>edit</mat-icon>
        <span>Edit</span>
      </button>
      <button
        mat-menu-item
        class="flex items-center"
        [routerLink]="deleteRouteField"
        (click)="handleDelete()"
      >
        <mat-icon [ngStyle]="{ color: 'rgba(244, 64, 52)' }">delete</mat-icon>
        <span class="mr-2 text-matRed-500">Delete</span>
      </button>
    </looper-ui-context-menu>
  `,
})
export class LooperUIListItemComponent {
  @Input() item: any;
  @Input() labelField: string;
  @Input() editRouteField: string;
  @Input() deleteRouteField: string;
  @Input() openInNewTab = false;
  @Input() disableContextMenu = false;

  @Output() click = new EventEmitter<void>();
  @Output() edited = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  @ViewChild(LooperUIContextMenuComponent) menu: LooperUIContextMenuComponent;

  constructor(private _router: Router) {}

  handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    if (!this.disableContextMenu) this.menu.toggle(e);
  }

  public handleClick() {
    this.click.emit();
  }

  public handleEdit() {
    this.edited.emit();
  }

  public handleDelete() {
    this.deleted.emit();
  }

  public handleOpenInNewTab() {
    const url = this._router.serializeUrl(
      this._router.createUrlTree([this.item[this.editRouteField]])
    );
    window.open(url, '_blank');
  }
}

@Component({
  selector: 'looper-ui-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    LooperUIContextMenuComponent,
    LooperUIListItemComponent,
  ],
  template: `
    <div
      *ngIf="isLoading"
      class="flex flex-col flex-1 items-center justify-center"
    >
      <mat-spinner></mat-spinner>
    </div>

    <!-- loaded list -->
    <div *ngIf="!isLoading" class="flex flex-col gap-2 items-stretch">
      <ng-container *ngFor="let i of items">
        <looper-ui-list-item
          [item]="i"
          [labelField]="labelField"
          [editRouteField]="editRouteField"
          [deleteRouteField]="deleteRouteField"
          [openInNewTab]="openInNewTab"
          [disableContextMenu]="disableContextMenu"
          (edited)="handleEdit(i)"
          (deleted)="handleDelete(i)"
        ></looper-ui-list-item>
      </ng-container>
    </div>
  `,
})
export class LooperUIListComponent {
  @HostBinding('class')
  classes = 'flex flex-col';

  @Input() items: any[] | null;
  @Input() editRouteField: string;
  @Input() deleteRouteField: string;
  @Input() labelField: string;
  @Input() isLoading = false;
  @Input() openInNewTab = false;
  @Input() disableContextMenu = false;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  // lifecycle ---------------------------------------------------------------------------------------------------------

  // event handlers ----------------------------------------------------------------------------------------------------

  handleDelete(item: any) {
    this.delete.emit(item);
  }

  handleEdit(item: any) {
    this.edit.emit(item);
  }
}
