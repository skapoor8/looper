import { cloneDeep } from 'lodash';
import { ISubscription } from '@gcloud-function-api-auth/interfaces';
import { LooperUIButtonBoxComponent } from './../../../shared/components/button-box.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscriptionsManagePresenter } from '../presenters/subscriptions-manage.presenter';
import { LooperUIPageComponent } from './../../../shared/components/page.component';
import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take, throwError } from 'rxjs';

@Component({
  selector: 'looper-subscriptions-manage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    LooperUIPageComponent,
    LooperUIButtonBoxComponent,
  ],
  template: `
    <looper-ui-page
      *ngIf="vm$ | async as vm"
      [title]="'Manage subscription to ' + vm.elistName"
      class="flex flex-1"
      [showBackButton]="false"
    >
      <div pageMain class="flex flex-col flex-1 items-stretch gap-3">
        <div *ngIf="vm.isLoading" class="flex flex-1 flex-col items-center">
          <mat-spinner></mat-spinner>
        </div>
        <div
          *ngIf="vm.isLoading === false"
          class="flex flex-1 flex-col items-center justify-center pb-10 gap-2"
        >
          <h1>Welcome back {{ vm.subscriberName }}!</h1>

          <div class="flex flex-row items-center gap-2 mb-8">
            <span class="text-gray-500">Status:</span>
            <span
              class="p-[2px] px-[4px] rounded-md"
              [ngClass]="
                (vm$ | async)?.isSubscriptionActive
                  ? 'bg-matGreen-200 text-matGreen-600'
                  : 'bg-matRed-200 text-matRed-600'
              "
            >
              {{ (vm$ | async)?.isSubscriptionActive ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="flex flex-row gap-2">
            <looper-ui-button-box
              label="User Info"
              icon="alternate_email"
              routerLink="user-info"
            ></looper-ui-button-box>
            <looper-ui-button-box
              label="Preferences"
              icon="settings"
              routerLink="preferences"
              [disabled]="(vm$ | async)?.isSubscriptionActive === false"
            ></looper-ui-button-box>
            <looper-ui-button-box
              [label]="
                (vm$ | async)?.isSubscriptionActive
                  ? 'Unsubscribe'
                  : 'Reactivate'
              "
              [icon]="
                (vm$ | async)?.isSubscriptionActive
                  ? 'unsubscribe'
                  : 'notification_add'
              "
              [ngClass]="
                (vm$ | async)?.isSubscriptionActive
                  ? 'outline-matRed-400 hover:text-matRed-500'
                  : '!outline-matGreen-400 hover:!text-matGreen-500'
              "
              (click)="handleChangeIsActive()"
            ></looper-ui-button-box>
          </div>
        </div>
      </div>
    </looper-ui-page>
  `,
})
export class SubscriptionsManageComponent {
  @HostBinding('class')
  _classes = 'flex flex-col flex-1';

  public subscription$ = this._presenter.subscription$;
  public vm$ = this._presenter.vm$;

  constructor(private _presenter: SubscriptionsManagePresenter) {}

  handleChangeIsActive() {
    this._presenter.subscription$.pipe(take(1)).subscribe({
      next: (sub) => {
        if (sub.data) {
          const updated: ISubscription = {
            ...sub.data,
            elistId: sub?.data.elist.id,
            isActive: !sub.data.isActive,
          };
          this._presenter.updateSubscription(updated).subscribe({
            error: (e) => {
              console.error('Update failed:', e);
            },
            next: (n) => console.log('updated:', n),
          });
        } else {
          throwError(() => new Error('Subscription cannot be empty here'));
        }
      },
    });
  }
}
