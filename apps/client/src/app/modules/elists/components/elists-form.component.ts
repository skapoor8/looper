import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    // feature
    ElistsFormFieldErrorComponent,
  ],
  providers: [ElistsPresenter],
  selector: 'looper-elists-form',
  template: `
    <!-- title + actions -->
    <div class="flex flex-row items-center gap-2 pb-3 border-b">
      <button
        mat-icon-button
        class="!h-9 !w-9 !p-[0.33rem]"
        routerLink="/elists"
      >
        <i class="material-icons text-gray-500">chevron_left</i>
      </button>
      <span class="uppercase font-semibold flex-1 text-gray-500">
        {{
          (mode$ | async) === ElistFormMode.CREATE ? 'Add Elist' : 'Edit Elist'
        }}
      </span>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!(elistForm?.valid && elistForm?.dirty)"
        (click)="handleSave()"
      >
        Save
      </button>
    </div>

    <!-- create/edit form -->
    <form *ngIf="elistForm" [formGroup]="elistForm" class="w-full">
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Elist Name</mat-label>
        <input matInput formControlName="elistName" (change)="handleChange()" />
        <mat-error *ngIf="elistForm.controls['elistName'].invalid">
          <looper-elists-form-field-error
            [errors]="elistForm.controls['elistName'].errors"
          ></looper-elists-form-field-error>
        </mat-error>
      </mat-form-field>
    </form>
  `,
  host: {
    class: 'flex flex-col flex-1 gap-2 w-full p-4 bg-slate-100',
  },
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
  // state -------------------------------------------------------------------------------------------------------------

  public elistForm?: ClassValidatorFormGroup;
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
    const id = this._activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this._presenter.setMode(ElistFormMode.EDIT);
      this._presenter.userElists$.subscribe({
        next: (elists) => {
          const found = elists?.data?.find((list) => list.id === id);
          if (found) {
            this.elistForm = this._fb.group(ElistModel, {
              id: found.id,
              elistName: found.elistName,
              ownerId: found.ownerId,
            });
          } else {
            throwError(
              () =>
                new Error(`Attempting to edit non-existent elist with id ${id}`)
            );
          }
        },
      });
    } else {
      this._presenter.setMode(ElistFormMode.CREATE);
      this.elistForm = this._fb.group(ElistNewModel, {
        elistName: '',
        ownerId: '',
      });

      this._presenter.user$.pipe(take(1)).subscribe({
        next: (u) => {
          this.elistForm?.patchValue({ ownerId: u?.data?.id });
          this._cdr.detectChanges();
        },
      });
    }
  }

  ngOnDestroy() {
    this._subs.forEach((s) => s.unsubscribe());
  }

  // event handlers ----------------------------------------------------------------------------------------------------
  handleChange() {
    this._logger.debug(
      'elists.components.elist-form.handleChange: form =>',
      this.elistForm
    );
  }

  handleSave() {
    this._logger.debug(
      'elists.components.elist-form.handleSave: saving',
      this.elistForm?.getRawValue()
    );
    if (this._mode === ElistFormMode.CREATE) {
      this._presenter.createElist(this.elistForm?.getRawValue());
    } else {
      this._presenter.updateElist(this.elistForm?.getRawValue());
    }
  }
}
