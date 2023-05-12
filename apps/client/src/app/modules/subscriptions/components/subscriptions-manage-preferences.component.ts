import { MatButtonModule } from '@angular/material/button';
import { ISubscriptionWithElistInfoDTO } from '@gcloud-function-api-auth/interfaces';
import { FormBuilderComponent } from './../../form-builder/components/form-builder.component';
import { Component } from '@angular/core';
import { LooperUIPageComponent } from '../../../shared';
import { SubscriptionsManagePresenter } from '../presenters/subscriptions-manage.presenter';
import { map, filter, startWith, Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomainServiceLoadableStatus } from '../../../domain-services';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'looper-subscriptions-manage-preferences',
  standalone: true,
  imports: [
    CommonModule,
    LooperUIPageComponent,
    FormBuilderComponent,
    MatButtonModule,
  ],
  template: `
    <looper-ui-page title="Manage communication preferences">
      <!-- actions -->
      <ng-container pageActionsRight>
        <button
          *ngIf="formDef$ | async"
          mat-raised-button
          color="primary"
          [disabled]="!dynamicForm.touched"
          (click)="handleUpdate()"
        >
          Update
        </button>
      </ng-container>
      <div pageMain>
        <form>
          <form-builder
            #dynamicForm
            [formDefinition]="(formDef$ | async) ?? []"
            [editable]="false"
            [formValue]="formVal"
            (formValueChange)="handleFormValueChange($event)"
          ></form-builder>
        </form>
      </div>
    </looper-ui-page>
  `,
})
export class SubscriptionsManagePreferencesComponent {
  public formVal = {};

  formDef$ = this._presenter.elist$.pipe(map((e) => e.data?.settings ?? []));

  constructor(private _presenter: SubscriptionsManagePresenter) {}

  ngOnInit() {
    this._presenter.subscription$
      .pipe(
        filter((sub) => sub.status === DomainServiceLoadableStatus.COMPLETE),
        map(
          (sub) =>
            cloneDeep(sub.data?.settings ?? {}) as Record<
              string,
              string | string[] | boolean
            >
        ),
        startWith({} as Record<string, string | string[] | boolean>)
      )
      .subscribe({
        next: (fv) => {
          this.formVal = fv;
        },
      });
  }

  handleFormValueChange(val: any) {
    // console.log('update form value:', val);
    this.formVal = val;
  }

  handleUpdate() {
    this._presenter.subscription$.pipe(take(1)).subscribe({
      next: (sub) => {
        if (sub.status === DomainServiceLoadableStatus.COMPLETE) {
          const coerced = sub.data as ISubscriptionWithElistInfoDTO;
          this._presenter
            .updateSubscription({
              ...coerced,
              elistId: coerced.elist.id,
              settings: this.formVal,
            })
            .subscribe({
              next: (updated) => {
                // console.log('updated:', updated);
              },
              error: (e) => console.error(e),
            });
        }
      },
    });
  }
}
