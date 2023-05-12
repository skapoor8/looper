import { ElistPreferenceType } from '@gcloud-function-api-auth/interfaces';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Component, HostBinding, Inject, Input } from '@angular/core';

@Component({
  selector: 'form-builder-control-add-dialog-button',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  template: `
    <mat-icon>{{ icon }}</mat-icon>
    <span class="text-xs">{{ label }}</span>
  `,
})
export class FormBuilderControlAddDialogButtonComponent {
  @Input()
  icon: string = 'add';

  @Input()
  label: string = 'label';

  @HostBinding('class')
  get classes() {
    return 'flex flex-col h-20 w-20 items-center justify-center border border-gray-300 rounded-sm hover:outline outline-2 outline-matPrimary-400 outline-offset-0 hover:border-white hover:text-matPrimary-500';
  }
}

@Component({
  selector: 'form-builder-control-add-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    FormBuilderControlAddDialogButtonComponent,
  ],
  template: `
    <h1 class="!mb-0" mat-dialog-title>Add Setting</h1>
    <div mat-dialog-content>
      <div class="flex flex-row pt-1 gap-2 mt-[-5px]">
        <form-builder-control-add-dialog-button
          icon="toggle_off"
          label="toggle"
          (click)="handleAdd(ELIST_PREF_TYPE.BOOLEAN)"
        ></form-builder-control-add-dialog-button>
        <form-builder-control-add-dialog-button
          icon="radio_button_checked"
          label="radio"
          (click)="handleAdd(ELIST_PREF_TYPE.RADIO)"
        ></form-builder-control-add-dialog-button>
        <form-builder-control-add-dialog-button
          icon="check_box"
          label="checkbox"
          (click)="handleAdd(ELIST_PREF_TYPE.CHECKBOX)"
        ></form-builder-control-add-dialog-button>
      </div>
    </div>
  `,
})
export class FormBuilderControlAddDialogComponent {
  public ELIST_PREF_TYPE = ElistPreferenceType;

  constructor(
    private _dialogRef: MatDialogRef<FormBuilderControlAddDialogButtonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  handleAdd(type: ElistPreferenceType) {
    this._dialogRef.close(type);
  }
}
