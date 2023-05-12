import { FormBuilderControlAddDialogComponent } from './form-builder-control-add-dialog.component';
import {
  ElistPreferenceDefinitions,
  IElistPreference,
} from '@gcloud-function-api-auth/interfaces';
import { FormBuilderControlEditorComponent } from './form-builder-control-editor.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilderControlPreviewComponent } from './form-builder-control-preview.component';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ElistPreferenceType } from '@gcloud-function-api-auth/interfaces';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    FormBuilderControlPreviewComponent,
    FormBuilderControlEditorComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FormBuilderComponent,
    },
  ],
  selector: 'form-builder',
  template: `
    <div class="flex flex-col gap-2 items-stretch">
      <form-builder-control-preview
        *ngFor="let field of formDefinition; let i = index"
        [pref]="field"
        (prefChange)="handleControlUpdate(i, $event)"
        (click)="handleEdit(i, field)"
        (edited)="handleEdit(i, field)"
        (deleted)="handleDelete(i)"
        [editable]="editable"
        [value]="formValue[field.prompt]"
        (valueChange)="handleControlValueUpdate(field.prompt, $event)"
      ></form-builder-control-preview>
    </div>

    <div
      *ngIf="editable"
      class="flex flex-row h-14 items-center justify-center box-border border border-gray-400 border-dashed rounded-md text-gray-400 cursor:pointer hover:border-matPrimary-400 hover:border-2 hover:text-matPrimary-500 cursor-pointer"
      (click)="handleAdd()"
    >
      <mat-icon class="text-base">add</mat-icon>
      ADD SETTING
    </div>

    <mat-menu #addControlMenu>
      <button mat-menu-item (click)="addToggleControl()">Toggle</button>
      <button mat-menu-item (click)="addRadioControl()">Radio</button>
      <button mat-menu-item (click)="addCheckboxControl()">Checkbox</button>
    </mat-menu>

    <!-- <div>
      <button
        mat-fab

        color="primary"
        aria-label="Example icon button with a delete icon"
      >
        <mat-icon>add</mat-icon>
      </button>


    </div> -->

    <!-- {{ formDefinition | json }} -->
  `,
})
export class FormBuilderComponent implements ControlValueAccessor {
  @Input() formDefinition: IElistPreference[] = [];
  @Output() formDefinitionChange = new EventEmitter<IElistPreference[]>();

  @Input() formValue: Record<string, string | string[] | boolean> = {};
  @Output() formValueChange = new EventEmitter<
    Record<string, string | string[] | boolean>
  >();

  @Input() editable = true;

  @HostBinding('class')
  get classes() {
    return 'flex flex-col gap-2';
  }

  onChange = (fDef: any) => {};
  onTouched: any;
  touched = false;
  disabled = false;

  constructor(private _dialog: MatDialog) {}

  ngOnInit() {
    // console.error('formDef:', this.formDefinition);
  }

  handleAdd() {
    const ref = this._dialog.open(FormBuilderControlAddDialogComponent);
    ref.afterClosed().subscribe((result: ElistPreferenceType) => {
      switch (result) {
        case ElistPreferenceType.BOOLEAN:
          this.addToggleControl();
          break;
        case ElistPreferenceType.CHECKBOX:
          this.addCheckboxControl();
          break;
        case ElistPreferenceType.RADIO:
          this.addRadioControl();
          break;
        default:
          break;
      }
    });
  }

  handleEdit(index: number, pref: IElistPreference) {
    if (this.editable) {
      const editor = this._dialog.open(FormBuilderControlEditorComponent, {
        data: {
          pref,
        },
        width: '60vw',
      });

      editor.componentInstance.formUpdated
        .pipe(takeUntil(editor.afterClosed()))
        .subscribe({
          next: (updatedPref) => {
            this.handleControlUpdate(index, updatedPref);
          },
        });
    }
  }

  handleDelete(index: number) {
    if (this.editable) {
      this.markAsTouched();
      this.formDefinition.splice(index, 1);
      this.formDefinitionChange.emit(this.formDefinition);
      this.onChange(this.formDefinition);
    }
  }

  addToggleControl() {
    this.markAsTouched();
    this.formDefinition.push(
      ElistPreferenceDefinitions.find(
        (d) => d.type === ElistPreferenceType.BOOLEAN
      ) as IElistPreference
    );
    this.formDefinitionChange.emit(this.formDefinition);
    this.onChange(this.formDefinition);
  }

  addRadioControl() {
    this.markAsTouched();
    // console.error('fDef', this.formDefinition);
    this.formDefinition.push(
      ElistPreferenceDefinitions.find(
        (d) => d.type === ElistPreferenceType.RADIO
      ) as IElistPreference
    );
    this.formDefinitionChange.emit(this.formDefinition);
    this.onChange(this.formDefinition);
  }

  addCheckboxControl() {
    this.markAsTouched();
    this.formDefinition.push(
      ElistPreferenceDefinitions.find(
        (d) => d.type === ElistPreferenceType.CHECKBOX
      ) as IElistPreference
    );
    this.formDefinitionChange.emit(this.formDefinition);
    this.onChange(this.formDefinition);
  }

  handleControlUpdate(position: number, updated: IElistPreference) {
    // console.log(`control at index ${position} updated:`, updated);
    this.markAsTouched();
    this.formDefinition[position] = updated;
    this.formDefinitionChange.emit(this.formDefinition);
    this.onChange(this.formDefinition);
  }

  handleControlValueUpdate(prompt: string, val: string | string[] | boolean) {
    this.markAsTouched();
    const updated = { ...this.formValue };
    updated[prompt] = val;
    this.formValueChange.emit(updated);
  }

  writeValue(newDef: { array: IElistPreference[] }) {
    // console.trace('writeValue:', newDef, this);
    this.formDefinition = newDef?.array ?? [];
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      // console.log('touched~');
      if (this.onTouched) this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
