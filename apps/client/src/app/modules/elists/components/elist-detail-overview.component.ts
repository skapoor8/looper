import { MatButtonModule } from '@angular/material/button';
import {
  LooperUITabComponent,
  LooperUIPageComponent,
  LooperUITabsComponent,
} from './../../../shared';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'looper-elist-detail-overview',
  imports: [
    LooperUIPageComponent,
    LooperUITabComponent,
    LooperUITabsComponent,
    MatButtonModule,
    RouterModule,
  ],
  template: `
    <looper-ui-page backRoute="../..">
      <ng-container pageActionsLeft>
        <looper-ui-tabs>
          <looper-ui-tab icon="home" label="Overview" route="/"></looper-ui-tab>
          <looper-ui-tab
            icon="groups"
            label="Subscribers"
            route="../subscriptions"
          ></looper-ui-tab>
          <looper-ui-tab
            icon="settings"
            label="Settings"
            route="../settings"
          ></looper-ui-tab>
        </looper-ui-tabs>
      </ng-container>
      <ng-container pageActionsRight>
        <button mat-raised-button color="primary" routerLink="../edit">
          EDIT
        </button>
      </ng-container>
      <div pageMain>
        <h1>Overview</h1>
        Links:
        <ol>
          <li><a routerLink="../subscribe">Subscribe</a></li>
          <li><a>Manage</a></li>
        </ol>
      </div>
    </looper-ui-page>
  `,
})
export class ElistDetailOverviewComponent {}
