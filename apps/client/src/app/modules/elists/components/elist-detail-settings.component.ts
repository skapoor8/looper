import { NotificationsServiceModule } from './../../../shared';
import { ElistsFormComponent } from './elists-form.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  LooperUITabComponent,
  LooperUIPageComponent,
  LooperUITabsComponent,
} from './../../../shared';
import { Component, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'looper-elist-detail-settings',
  imports: [
    ElistsFormComponent,
    MatButtonModule,
    NotificationsServiceModule,
    LooperUIPageComponent,
    LooperUITabComponent,
    LooperUITabsComponent,
  ],
  template: `
    <looper-ui-page backRoute="../..">
      <ng-container pageActionsLeft>
        <looper-ui-tabs>
          <looper-ui-tab
            icon="groups"
            label="Subscribers"
            route="../subscriptions"
          ></looper-ui-tab>
          <looper-ui-tab
            icon="settings"
            label="Settings"
            route="."
          ></looper-ui-tab>
        </looper-ui-tabs>
      </ng-container>
      <ng-container pageActionsRight>
        <button
          mat-raised-button
          color="primary"
          routerLink="edit"
          [disabled]="formHasChanges === false && formIsDirty === false"
          (click)="handleUpdate()"
        >
          UPDATE
        </button>
      </ng-container>
      <div pageMain class="flex-1">
        <looper-elists-form
          #elistForm
          (hasChanges)="formHasChanges = $event"
          (isDirty)="formIsDirty = $event"
        ></looper-elists-form>
      </div>
    </looper-ui-page>
  `,
})
export class ElistDetailSettingsComponent {
  @ViewChild('elistForm')
  private _elistForm: ElistsFormComponent;

  public formHasChanges = false;
  public formIsDirty = false;

  handleUpdate() {
    this._elistForm.handleSave();
  }
}
