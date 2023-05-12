import { LooperUIPageComponent } from './../../../shared/components/page.component';
import { IElistPreference } from '@gcloud-function-api-auth/interfaces';
import { FormBuilderComponent } from './../../form-builder/components/form-builder.component';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ElistsPresenter } from '../presenters';
import {
  ClassValidatorFormBuilderService,
  ClassValidatorFormGroup,
} from 'ngx-reactive-form-class-validator';
import { ElistModel, ElistNewModel } from '@gcloud-function-api-auth/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ElistsFormFieldErrorComponent } from './elists-form-field-error.component';
import {
  map,
  Subscription,
  switchAll,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ElistFormMode } from '../interfaces';
import { NGXLogger } from 'ngx-logger';
import { cloneDeep } from 'lodash-es';
import { NotificationsService } from '../../../shared';

@Component({
  standalone: true,
  imports: [
    // ng
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    // ui
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    // looper ui
    LooperUIPageComponent,
    // feature
    ElistsFormFieldErrorComponent,
    FormBuilderComponent,
  ],
  selector: 'looper-elists-form',
  template: `
    <!-- actions -->
    <!-- <ng-container pageActionsRight>
        <button
          mat-raised-button
          color="primary"
          [disabled]="!(elistForm?.valid && elistForm?.dirty)"
          (click)="handleSave()"
        >
          Save
        </button>
      </ng-container> -->

    <!-- create/edit form -->
    <form pageMain *ngIf="elistForm" [formGroup]="elistForm" class="w-full">
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Elist Name</mat-label>
        <input matInput formControlName="elistName" />
        <mat-error *ngIf="elistForm.controls['elistName'].invalid">
          <looper-elists-form-field-error
            [errors]="elistForm.controls['elistName'].errors"
          ></looper-elists-form-field-error>
        </mat-error>
      </mat-form-field>

      <label class="flex text-xs text-matGrey-600 pl-3 pb-2">
        Elist Settings
      </label>
      <form-builder #custom formControlName="settings"></form-builder>
    </form>
  `,
  styles: [
    `
      :host {
        mat-form-field ::ng-deep {
          .mat-mdc-text-field-wrapper {
            @apply bg-white;
          }

          .mat-mdc-text-field-wrapper.mdc-text-field--focused {
            @apply bg-white #{!important};
          }

          .mat-mdc-form-field-focus-overlay {
            background: none;
          }
        }
      }
    `,
  ],
})
export class ElistsFormComponent implements OnInit {
  @HostBinding('class')
  _classes = 'flex flex-col flex-1 gap-2 w-full bg-slate-100';

  @Output() hasChanges = new EventEmitter<boolean>(false);
  @Output() isDirty = new EventEmitter<boolean>(false);

  // state -------------------------------------------------------------------------------------------------------------

  public elistForm?: ClassValidatorFormGroup;
  public elistPreferences: IElistPreference[];
  public mode$ = this._presenter.mode$;
  private _mode: ElistFormMode;
  public userId$ = this._presenter.user$.pipe(map((u) => u?.data?.id));

  // utility classes
  private _subs: Subscription[] = [];

  // enums
  public ElistFormMode = ElistFormMode;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _logger: NGXLogger,
    private _fb: ClassValidatorFormBuilderService,
    private _presenter: ElistsPresenter,
    private _notifications: NotificationsService,
    private _activeRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._subs.push(
      this._presenter.mode$.subscribe({
        next: (m) => (this._mode = m),
      })
    );

    // build form based on create/edit mode
    this._presenter.selectedElist$
      .pipe(
        take(1),
        map((sel) => cloneDeep(sel)) // avoid corrupting data in case of back
      )
      .subscribe({
        next: (sel) => {
          if (sel?.data) {
            this._presenter.setMode(ElistFormMode.EDIT);
            this.elistForm = this._fb.group(ElistModel, {
              id: sel.data.id,
              elistName: sel.data.elistName,
              ownerId: sel.data.ownerId,
              settings: { array: sel.data.settings ?? [] },
            });
          } else {
            this._presenter.setMode(ElistFormMode.CREATE);
            this.elistForm = this._fb.group(ElistNewModel, {
              elistName: '',
              ownerId: '',
              settings: [],
            });
            // this.elistPreferences = [];

            this._presenter.user$.pipe(take(1)).subscribe({
              next: (u) => {
                this.elistForm?.patchValue({ ownerId: u?.data?.id });
                this._cdr.detectChanges();
              },
            });
          }
        },
      });

    this.elistForm?.valueChanges.subscribe({
      next: () => {
        this.hasChanges.emit(this.elistForm?.valid ?? false);
        this.isDirty.emit(this.elistForm?.dirty ?? false);
      },
    });
  }

  ngOnDestroy() {
    this._subs.forEach((s) => s.unsubscribe());
  }

  // event handlers ----------------------------------------------------------------------------------------------------
  handleChange() {
    // this._logger.debug(
    //   'elists.components.elist-form.handleChange: form =>',
    //   this.elistForm
    // );
  }

  handleFormDefinitionUpdate() {}

  getRawValue() {
    return this.elistForm?.getRawValue();
  }

  handleSave() {
    this._logger.info(
      'elists.components.elist-form.handleSave: saving',
      this.elistForm?.getRawValue()
    );
    if (this._mode === ElistFormMode.CREATE) {
      this._presenter.createElist(this.elistForm?.getRawValue()).subscribe({
        next: () => this._notifications.success('Elist created'),
        error: () => this._notifications.error('Elist could not be created'),
      });
    } else {
      this._presenter.updateElist(this.elistForm?.getRawValue()).subscribe({
        next: () => this._notifications.success('Elist updated'),
        error: () => this._notifications.error('Elist could not be update'),
      });
    }
  }
}
