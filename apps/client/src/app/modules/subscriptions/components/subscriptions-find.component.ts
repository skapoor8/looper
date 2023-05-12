import { MatButtonModule } from '@angular/material/button';
import { DomainServiceLoadableStatus } from './../../../domain-services/enums';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LooperUIPageComponent } from './../../../shared/components/page.component';
import { Component } from '@angular/core';
import { SubscriptionsFindPresenter } from '../presenters/subscriptions-find.presenter';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LooperUIPageComponent,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'looper-subscriptions-find',
  template: `
    <looper-ui-page
      [hideActions]="true"
      class="flex flex-1"
      [showBackButton]="false"
    >
      <div
        pageMain
        *ngIf="
          (vm$ | async)?.elistFound === DOMAIN_SERVICE_LOADABLE_STATUS.FAILED
        "
        class="flex flex-col flex-1 items-center justify-center gap-3 text-red-600"
      >
        <h1>Uh oh, something went wrong...</h1>
        <p>Looks like this elist no longer exists</p>
      </div>

      <div
        pageMain
        *ngIf="
          (vm$ | async)?.elistFound === DOMAIN_SERVICE_LOADABLE_STATUS.COMPLETE
        "
        class="flex flex-col flex-1 items-center justify-center gap-3"
      >
        <h1>
          Find your subscription for elist "{{ (vm$ | async)?.elistName }}"
        </h1>

        <span>What's your email?</span>

        <div class="flex flex-row gap-2 items-stretch">
          <mat-form-field class="!min-w-[250px]">
            <input #emailInput matInput placeholder="yourname@example.com" />
          </mat-form-field>

          <button
            class="!h-[3.5rem]"
            mat-raised-button
            color="primary"
            [disabled]="!emailInput.value"
            (click)="handleFindEmail(emailInput.value)"
          >
            <div class="flex flex-row gap-1 !items-center">
              <span class="text-base">GO</span>
              <mat-icon>arrow_forward</mat-icon>
            </div>
          </button>
        </div>

        <p
          *ngIf="
            (vm$ | async)?.subscriptionFound ===
            DOMAIN_SERVICE_LOADABLE_STATUS.FAILED
          "
          class="text-matRed-600"
        >
          Looks like you are not subscribed to this elist!
          <a
            [routerLink]="['/', 'elists', (vm$ | async)?.elistId, 'subscribe']"
            class="underline hover:font-semibold"
            >Sign up here.</a
          >
        </p>
      </div>
    </looper-ui-page>
  `,
})
export class SubscriptionsFindComponent {
  public vm$ = this._presenter.vm$;
  public DOMAIN_SERVICE_LOADABLE_STATUS = DomainServiceLoadableStatus;

  constructor(
    private _presenter: SubscriptionsFindPresenter,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._route.queryParamMap.subscribe({
      next: (qMap) => {
        const elistId = qMap.get('elistId');
        this._presenter.load(elistId ?? '');
      },
    });
  }

  public handleFindEmail(email: string) {
    this._presenter.findSubscription(email);
  }
}
