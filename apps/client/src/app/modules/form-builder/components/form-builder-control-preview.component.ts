import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  IElistPreference,
  ElistPreferenceType,
} from '@gcloud-function-api-auth/interfaces';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilderRowContainerComponent } from './form-builder-row-container.component';
import { FormBuilderControlEditorComponent } from './form-builder-control-editor.component';
import { takeUntil } from 'rxjs';
import { LooperUIContextMenuComponent } from '../../../shared';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    FormBuilderRowContainerComponent,
    LooperUIContextMenuComponent,
  ],
  selector: 'form-builder-control-preview',
  template: `
    <div
      [ngSwitch]="pref.type"
      class="flex flex-col items-stretch gap-2"
      (contextmenu)="handleRightClick($event)"
    >
      <form-builder-row-container
        *ngSwitchCase="PREF_TYPE.BOOLEAN"
        [editable]="editable"
      >
        <div class="flex flex-col gap-3">
          <label>{{ pref.prompt }}</label>
          <div class="flex flex-row pl-3">
            <mat-slide-toggle
              color="primary"
              [disabled]="editable"
              [ngModel]="value"
              (ngModelChange)="handleValueChange($event)"
            >
            </mat-slide-toggle>
            <div class="flex-1"></div>
            <span>Yes/No</span>
          </div>
        </div>
      </form-builder-row-container>
      <form-builder-row-container
        *ngSwitchCase="PREF_TYPE.CHECKBOX"
        [editable]="editable"
      >
        <div class="flex flex-col items-stretch">
          <label>{{ pref.prompt }}</label>
          <mat-checkbox
            *ngFor="let c of pref.choices"
            color="primary"
            [disabled]="editable"
            [ngModel]="isStringArray(value) ? value.includes(c) : false"
            (ngModelChange)="handleCheckboxValueChange($event, c)"
            >{{ c }}</mat-checkbox
          >
        </div>
      </form-builder-row-container>
      <form-builder-row-container
        *ngSwitchCase="PREF_TYPE.RADIO"
        [editable]="editable"
      >
        <div class="flex flex-col items-stretch">
          <label>{{ pref.prompt }}</label>
          <mat-radio-button
            *ngFor="let c of pref.choices"
            color="primary"
            [disabled]="editable"
            [value]="value === c"
            (change)="handleValueChange(c)"
            >{{ c }}</mat-radio-button
          >
        </div>
      </form-builder-row-container>

      <!-- edit button -->
    </div>

    <looper-ui-context-menu #menu>
      <button mat-menu-item class="border border-b-0" (click)="edited.emit()">
        <mat-icon>edit</mat-icon>
        <span>Edit</span>
      </button>
      <button mat-menu-item class="flex items-center" (click)="deleted.emit()">
        <mat-icon [ngStyle]="{ color: 'rgba(244, 64, 52)' }">delete</mat-icon>
        <span class="mr-6 text-matRed-500">Delete</span>
      </button>
    </looper-ui-context-menu>
  `,
})
export class FormBuilderControlPreviewComponent {
  @Input()
  pref: IElistPreference;
  @Output()
  prefChange = new EventEmitter<IElistPreference>();

  @Input()
  editable = false;

  @Input() value: string | boolean | string[];
  @Output() valueChange = new EventEmitter<string | boolean | string[]>();

  @Output() edited = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  @ViewChild(LooperUIContextMenuComponent) menu: LooperUIContextMenuComponent;

  public PREF_TYPE = ElistPreferenceType;

  constructor(private _dialog: MatDialog) {}

  public handleRightClick(e: MouseEvent) {
    e.preventDefault();
    if (this.editable) {
      this.menu.toggle(e);
    }
  }

  handleCheckboxValueChange(isChecked: boolean, val: string) {
    const updated = (this.value as string[]) ?? [];
    if (isChecked) {
      updated.push(val);
    } else {
      updated.splice(updated.indexOf(val), 1);
    }
    this.valueChange.emit(updated);
  }

  handleValueChange(val: string) {
    this.value = val;
    this.valueChange.emit(val);
  }

  /** @internal */ isStringArray(t: any): t is Array<string> {
    return t instanceof Array<string>;
  }
}
