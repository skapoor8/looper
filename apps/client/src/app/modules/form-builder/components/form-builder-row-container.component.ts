import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  selector: 'form-builder-row-container',
  template: `
    <!-- <mat-icon fontIcon="drag_indicator"></mat-icon> -->
    <div class="flex-1">
      <ng-content></ng-content>
    </div>
    <!-- <button mat-icon-button (click)="handleEdit()">
      <mat-icon>edit</mat-icon>
    </button> -->
  `,
})
export class FormBuilderRowContainerComponent {
  @Output()
  edit = new EventEmitter<void>();

  @Input()
  editable = true;

  @HostBinding('class')
  get _classes() {
    return this.editable
      ? 'flex flex-row bg-white border-box border border-gray-300 rounded-md p-3 cursor-pointer hover:border-gray-100 hover:outline outline-matPrimary-400 outline-2 outline-offset-0'
      : 'flex flex-row p-3';
  }

  constructor() {}

  handleEdit() {
    this.edit.emit();
  }
}
