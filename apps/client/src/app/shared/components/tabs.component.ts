import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  selector: 'looper-ui-tab',
  template: `
    <div
      [routerLink]="route"
      class="flex flex-row items-center gap-1"
      routerLinkActive=""
      (isActiveChange)="handleActiveChange($event)"
    >
      <mat-icon>{{ icon }}</mat-icon>
      <span>{{ label }}</span>
    </div>
  `,
})
export class LooperUITabComponent {
  private _isActive = false;
  private _classes =
    'flex flex-row gap-1 p-2 items-center rounded-md bg-matGrey-100 text-matGrey-800 cursor-pointer hover:bg-matGrey-200 hover:text-matGrey-900';
  private _activeClasses =
    'text-matPrimary-500 bg-matPrimary-100 brightness-[1.1] hover:text-matPrimary-600 hover:bg-matPrimary-150';
  @HostBinding('class')
  get classes() {
    return `${this._classes} ${this._isActive ? this._activeClasses : ''}`;
  }
  set classes(cs: string) {}

  @Input()
  public route: string = '';

  @Input()
  public icon = '';

  @Input()
  public label = '';

  public handleActiveChange(isActive: boolean) {
    this._isActive = isActive;
  }
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'looper-ui-tabs',
  template: `<ng-content></ng-content>`,
})
export class LooperUITabsComponent {
  @HostBinding('class')
  public class = 'flex flex-row gap-1';
}
