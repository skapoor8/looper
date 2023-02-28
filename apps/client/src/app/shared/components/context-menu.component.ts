import { Component, ViewChild } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  standalone: true,
  selector: 'looper-ui-context-menu',
  imports: [MatMenuModule],
  template: `
    <!-- context menu -->
    <div
      style="visibility: hidden; position: fixed"
      [style.left]="contextMenuPosition.x"
      [style.top]="contextMenuPosition.y"
      [matMenuTriggerFor]="contextMenu"
    ></div>
    <mat-menu #contextMenu="matMenu">
      <!-- <ng-template matMenuContent let-item="item">
        <button mat-menu-item>Action 1</button>
        <button mat-menu-item>Action 2</button>
      </ng-template> -->
      <ng-content></ng-content>
    </mat-menu>
  `,
})
export class LooperUIContextMenuComponent {
  // state -------------------------------------------------------------------------------------------------------------
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  contextData: any;

  contextMenuPosition = { x: '0px', y: '0px' };

  // lifecycle ---------------------------------------------------------------------------------------------------------

  // api ---------------------------------------------------------------------------------------------------------------

  open(event: MouseEvent, data?: any) {
    this._onContextMenu(event, data);
  }

  close() {
    this.contextMenu.closeMenu();
  }

  toggle(event: MouseEvent, data?: any) {
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    // if (data) this.contextMenu.menuData = { ...data };
    if (data) this.contextData = { ...data };
    this.contextMenu.menu?.focusFirstItem('mouse');
    this.contextMenu.toggleMenu();
  }

  // helpers -----------------------------------------------------------------------------------------------------------
  private _onContextMenu(event: MouseEvent, data?: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    // if (data) this.contextMenu.menuData = { ...data };
    if (data) this.contextData = { ...data };
    // this.contextMenu.menu?.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
}
