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
  selector: 'looper-elist-create',
  imports: [
    MatButtonModule,
    LooperUIPageComponent,
    LooperUITabComponent,
    LooperUITabsComponent,
    ElistsFormComponent,
  ],
  template: `
    <looper-ui-page backRoute=".." title="New Elist">
      <ng-container pageActionsRight>
        <button
          mat-raised-button
          color="primary"
          routerLink="edit"
          [disabled]="formHasChanges === false && formIsDirty === false"
          (click)="handleCreate()"
        >
          CREATE
        </button>
      </ng-container>
      <div pageMain>
        <looper-elists-form
          #elistForm
          (hasChanges)="formHasChanges = $event"
          (isDirty)="formIsDirty = $event"
        ></looper-elists-form>
      </div>
    </looper-ui-page>
  `,
})
export class ElistCreateComponent {
  @ViewChild('elistForm')
  private _elistForm: ElistsFormComponent;

  public formHasChanges = false;
  public formIsDirty = false;

  handleCreate() {
    this._elistForm.handleSave();
  }
}
