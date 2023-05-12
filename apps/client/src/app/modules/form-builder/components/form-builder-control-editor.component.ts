import { MatIconModule } from '@angular/material/icon';
import { IElistPreference } from './../../../../../../../libs/interfaces/src/lib/domain/elist-preference';
import { MatInputModule } from '@angular/material/input';
import { ElistPreferenceDefinitions } from './../../../../../../../libs/interfaces/src/lib/domain/definitions';
import { ElistPreferenceType } from './../../../../../../../libs/interfaces/src/lib/domain/enums';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ElistPreferenceModel } from './../../../../../../../libs/models/src/lib/domain/elist-preference.model';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  ClassValidatorFormBuilderService,
  ClassValidatorFormGroup,
} from 'ngx-reactive-form-class-validator';
import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'form-builder-control-editor',
  template: `
    <h1 mat-dialog-title>Edit Setting</h1>
    <div mat-dialog-content>
      <div [formGroup]="controlForm" class="flex flex-col gap-2">
        <mat-form-field>
          <mat-label>Input Type</mat-label>
          <mat-select formControlName="type">
            <mat-option
              *ngFor="let pref of ElistPreferenceTypeList"
              [value]="pref"
              >{{ pref }}</mat-option
            >
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Prompt</mat-label>
          <input matInput formControlName="prompt" />
        </mat-form-field>

        <mat-form-field
          appearance="fill"
          *ngIf="controlForm.controls['type'].value !== 'BOOLEAN'"
        >
          <mat-label>Choices</mat-label>
          <mat-chip-grid #chipGrid aria-label="Enter Choices">
            <mat-chip-row
              *ngFor="let c of choices.controls; let i = index"
              (removed)="handleRemoveChip(i)"
              [aria-description]="'press enter to edit ' + c.value.label"
            >
              {{ c.value.label }}
              <button matChipRemove [attr.aria-label]="'remove ' + c">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>
            <input
              placeholder="Add choice..."
              [matChipInputFor]="chipGrid"
              [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
              [matChipInputAddOnBlur]="addOnBlur"
              (matChipInputTokenEnd)="handleAddChip($event)"
            />
          </mat-chip-grid>
        </mat-form-field>
      </div>
      <!-- {{ data | json }} -->
    </div>
  `,
})
export class FormBuilderControlEditorComponent {
  @Output()
  formUpdated = new EventEmitter<IElistPreference>();

  public controlForm: ClassValidatorFormGroup = this._fb.group(
    ElistPreferenceModel,
    {
      type: ElistPreferenceType.BOOLEAN,
      prompt: 'Default',
      require: false,
    }
  );
  get choices() {
    return this.controlForm.controls['choices'] as FormArray;
  }

  public ElistPreferenceTypeList: string[] = ElistPreferenceDefinitions.map(
    (d) => d.type
  );
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public addOnBlur = true;

  public onDestroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: ClassValidatorFormBuilderService
  ) {
    this._buildForm();
    this._handleFormUpdates();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  handleAddChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      // console.log(
      //   'pushing val:',
      //   value,
      //   (this.controlForm.controls['choices'] as FormArray).value
      // );
      (this.controlForm.controls['choices'] as FormArray).push(
        this._fb.group(Object, { label: value })
      );
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  handleRemoveChip(index: number): void {
    // console.log('removing,', index);
    if (index >= 0) {
      (this.controlForm.controls['choices'] as FormArray).removeAt(index);
    }
  }

  // handleEditChip(fruit: Fruit, event: MatChipEditedEvent) {
  //   const value = event.value.trim();

  //   // Remove fruit if it no longer has a name
  //   if (!value) {
  //     this.remove(fruit);
  //     return;
  //   }

  //   // Edit existing fruit
  //   const index = this.fruits.indexOf(fruit);
  //   if (index >= 0) {
  //     this.fruits[index].name = value;
  //   }
  // }

  private _buildForm() {
    // console.log('buildForm: pref is', this.data.pref);
    const pref = this.data.pref as IElistPreference;
    if (pref.type === ElistPreferenceType.BOOLEAN) {
      this.controlForm = this._fb.group(ElistPreferenceModel, {
        type: pref.type,
        prompt: pref.prompt,
        required: false,
        choices: this._fb.array([]),
      });
    } else {
      this.controlForm = this._fb.group(ElistPreferenceModel, {
        type: pref.type,
        prompt: pref.prompt,
        choices: this._fb.array(
          (pref.choices as string[]).map((c) =>
            this._fb.group(Object, { label: c })
          )
        ),
        require: false,
      });
    }
  }

  private _handleFormUpdates() {
    this.controlForm.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (changes) => {
        // console.log('changes:', changes);
        this.formUpdated.next({
          ...changes,
          choices: changes.choices.map((c: { label: string }) => c.label),
        });
      },
    });
  }

  private _buildDefaultForm() {
    this.controlForm = this._fb.group(ElistPreferenceModel, {
      type: ElistPreferenceType.BOOLEAN,
      prompt: 'Default',
      require: false,
    });
  }
}
