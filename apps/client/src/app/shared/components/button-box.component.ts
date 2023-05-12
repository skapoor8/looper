import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'looper-ui-button-box',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  template: `
    <mat-icon>{{ icon }}</mat-icon>
    <span class="text-xs">{{ label }}</span>
  `,
})
export class LooperUIButtonBoxComponent {
  @Input()
  icon: string;

  @Input()
  label: string;

  @Input() disabled = false;

  @HostBinding('class')
  get classes() {
    return `flex flex-col h-20 w-20 items-center justify-center border border-gray-300 rounded-sm outline-offset-0 hover:outline outline-2 hover:border-white ${
      this.disabled
        ? 'outline-matGrey-400  hover:text-matGrey-500 text-matGrey-300'
        : 'outline-matPrimary-400  hover:text-matPrimary-500'
    }`;
  }

  @HostListener('click', ['$event'])
  handleClick(e: MouseEvent) {
    if (this.disabled) e.stopImmediatePropagation();
  }
}
