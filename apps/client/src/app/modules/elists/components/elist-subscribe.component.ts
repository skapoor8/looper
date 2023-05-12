import { SubscriptionsPresenter } from './../presenters/subscriptions.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionNewModel } from './../../../../../../../libs/models/src/lib/domain/subscription-new.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Component, HostBinding } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ElistsPresenter } from '../presenters';
import { map, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  ClassValidatorFormBuilderService,
  ClassValidatorFormGroup,
} from 'ngx-reactive-form-class-validator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LooperUIPageComponent,
  NotificationsService,
  NotificationsServiceModule,
} from '../../../shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NotificationsServiceModule,
    LooperUIPageComponent,
  ],
  selector: 'looper-elist-subscribe',
  template: `
    <looper-ui-page
      [hideActions]="true"
      class="flex flex-1 items-center justify-center"
      [showBackButton]="false"
      pageMainStyleClass="!items-center justify-center"
    >
      <div
        pageMain
        *ngIf="(elist$ | async)?.status === 'COMPLETE'"
        class="flex flex-col items-stretch gap-2 bg-white p-4 shadow-md w-[90vw] max-w-[500px] min-w-[250px]"
      >
        <h1>Subscribe to {{ (elist$ | async)?.data?.elistName }}</h1>
        <form *ngIf="subForm" class="flex flex-col" [formGroup]="subForm">
          <mat-form-field>
            <mat-label>Firstname</mat-label>
            <input matInput formControlName="firstName" />
            <mat-error></mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Lastname</mat-label>
            <input matInput formControlName="lastName" />
            <mat-error></mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" />
            <mat-error></mat-error>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            class="mt-5"
            (click)="handleSubmit()"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </looper-ui-page>
  `,
})
export class ElistSubscribeComponent {
  @HostBinding('class')
  public classes = 'flex flex-1 items-center justify-center w-full h-full';

  public elist$ = this._presenter.elist$;
  public subForm: ClassValidatorFormGroup;

  constructor(
    private _presenter: SubscriptionsPresenter,
    private _notifications: NotificationsService,
    private _fb: ClassValidatorFormBuilderService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._buildForm();
  }

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._presenter.load(id);
      this._buildForm();
    }
  }
  handleSubmit() {
    const newSub = this.subForm.getRawValue();
    this._presenter.createSubscription(newSub).subscribe({
      next: (createdSub) => {
        this._notifications.success('You are now subscribed!');
        this._router.navigate(['/', 'subscriptions', createdSub.id]);
      },
      error: () => this._notifications.error('Uh oh, something went wrong...'),
    });
  }

  // helpers -------------------------------------------------------------------

  private _buildForm() {
    this._presenter.elistId$.pipe(take(1)).subscribe({
      next: (elistId) => {
        this.subForm = this._fb.group(SubscriptionNewModel, {
          firstName: '',
          lastName: '',
          email: '',
          elistId: elistId,
          company: 'Unknown',
          phoneNumber: '-',
          phoneCountryCode: '-',
          userDidConsent: true,
          settings: this._fb.group(Object, {}),
        });
      },
    });
  }
}
