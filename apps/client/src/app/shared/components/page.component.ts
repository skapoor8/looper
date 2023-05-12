import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  selector: 'looper-ui-page',
  template: `
    <!-- title + actions -->
    <div
      *ngIf="!hideActions"
      class="flex flex-row items-center gap-3 px-4 py-3 border-b"
    >
      <button
        *ngIf="showBackButton"
        mat-icon-button
        class="!h-9 !w-9 !p-[0.33rem]"
        [routerLink]="backRoute"
      >
        <i class="material-icons text-gray-500">chevron_left</i>
      </button>
      <ng-content select="[pageActionsLeft]"></ng-content>
      <span class="uppercase font-semibold flex-1 text-gray-500">
        {{ title }}
      </span>
      <ng-content select="[pageActionsRight]"></ng-content>
    </div>

    <!-- main -->
    <div
      [ngClass]="[
        'flex flex-col flex-1 items-stretch p-4 overflow-y-scroll',
        pageMainStyleClass
      ]"
    >
      <ng-content select="[pageMain]"></ng-content>
    </div>
  `,
})
export class LooperUIPageComponent {
  @HostBinding('class')
  public classes =
    'fixed top-[64px] bottom-0 w-screen flex flex-col items-stretch';

  @Input() hideActions = false;
  @Input() showBackButton = true;
  @Input() title = '';
  @Input() backRoute: string | string[] = '..';
  @Input() pageMainStyleClass = '';
  @Output() back = new EventEmitter<void>();

  handleClickBack() {
    this.back.emit();
  }
}
