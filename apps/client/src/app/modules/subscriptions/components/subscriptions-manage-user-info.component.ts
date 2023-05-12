import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ISubscription,
  ISubscriptionWithElistInfoDTO,
} from '@gcloud-function-api-auth/interfaces';
import { filter, take, tap } from 'rxjs';
import { SubscriptionModel } from '@gcloud-function-api-auth/models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, HostBinding } from '@angular/core';
import { LooperUIPageComponent } from '../../../shared';
import {
  ClassValidatorFormBuilderService,
  ClassValidatorFormGroup,
} from 'ngx-reactive-form-class-validator';
import { SubscriptionsManagePresenter } from '../presenters/subscriptions-manage.presenter';
import { DomainServiceLoadableStatus } from '../../../domain-services';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'looper-subscriptions-manage-user-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    LooperUIPageComponent,
  ],
  template: `
    <looper-ui-page title="Update your info" class="flex flex-col flex-1">
      <!-- actions -->
      <ng-container pageActionsRight>
        <button
          *ngIf="userInfoForm"
          mat-raised-button
          color="primary"
          [disabled]="!(userInfoForm.valid && userInfoForm.dirty)"
          (click)="handleSave()"
        >
          Update
        </button>
      </ng-container>
      <div pageMain class="flex flex-col items-center">
        <mat-icon
          class="text-[100px] !h-[100px] !w-[100px] my-10 text-matGrey-600"
          >account_circle</mat-icon
        >
        <div class="flex flex-row flex-1 items-center justify-center w-full">
          <form
            *ngIf="userInfoForm"
            [formGroup]="userInfoForm"
            class="flex flex-col flex-1 items-stretch gap-2 max-w-[750px]"
          >
            <mat-form-field>
              <mat-label>Firstname</mat-label>
              <input matInput formControlName="firstName" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Lastname</mat-label>
              <input matInput formControlName="lastName" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Phone number</mat-label>
              <input matInput formControlName="phoneNumber" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Company</mat-label>
              <input matInput formControlName="company" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Company</mat-label>
              <input matInput formControlName="company" />
            </mat-form-field>
          </form>
        </div>
      </div>
    </looper-ui-page>
  `,
})
export class SubscriptionsManageUserInfoComponent {
  @HostBinding('class')
  _classes = 'flex flex-col flex-1';

  public userInfoForm: ClassValidatorFormGroup;
  public subscription$ = this._presenter.subscription$;

  constructor(
    private _presenter: SubscriptionsManagePresenter,
    private _fb: ClassValidatorFormBuilderService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._presenter.subscription$
      .pipe(
        filter((sub) => sub.status === DomainServiceLoadableStatus.COMPLETE),
        take(1)
      )
      .subscribe({
        next: (sub) =>
          this._buildForm(sub.data as ISubscriptionWithElistInfoDTO),
      });
  }

  public handleSave() {
    const sub: ISubscription = this.userInfoForm.getRawValue();
    if (!sub.phoneNumber) sub.phoneNumber = '-';
    if (!sub.phoneCountryCode) sub.phoneCountryCode = '-';
    if (!sub.company) sub.company = 'Unknown';
    if (!sub.userDidConsent) sub.userDidConsent = true;
    if (!sub.settings) sub.settings = {};

    this._presenter.updateSubscription(sub).subscribe({
      next: async () => {
        await this._router.navigate(['..'], { relativeTo: this._route });
      },
    });
  }

  private _buildForm(sub: ISubscriptionWithElistInfoDTO) {
    this.userInfoForm = this._fb.group(
      SubscriptionModel,
      SubscriptionModel.fromSubscriptionWithElistInfoDTO(sub).toObject()
    );
  }
}
