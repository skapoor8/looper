import { IsLoggedInGuard } from './../shell/guards/is-logged-in.guard';
import { ElistDetailSubscriptionsComponent } from './components/elist-detail-subscriptions.component';
import { ElistDetailOverviewComponent } from './components/elist-detail-overview.component';
import { Route } from '@angular/router';
import { ElistDetailComponent } from './components/elists-detail.component';
import { ElistsFormComponent } from './components/elists-form.component';
import { ElistListComponent } from './components/elists-list.component';
import { ElistDetailSettingsComponent } from './components/elist-detail-settings.component';
import { ElistMiniAppComponent, ElistSubscribeComponent } from './components';
import { ElistCreateComponent } from './components/elist-create.component';

export const routes: Route[] = [
  {
    path: ':id/subscribe',
    component: ElistSubscribeComponent,
  },
  {
    path: '',
    component: ElistMiniAppComponent,
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: '',
        component: ElistListComponent,
      },
      {
        path: 'create',
        component: ElistCreateComponent,
      },
      {
        path: ':id',
        component: ElistDetailComponent,
        children: [
          {
            path: '',
            redirectTo: 'subscriptions',
            pathMatch: 'full',
          },
          {
            path: 'subscriptions',
            component: ElistDetailSubscriptionsComponent,
          },
          {
            path: 'settings',
            component: ElistDetailSettingsComponent,
          },
          // {
          //   path: 'subscribe',
          //   component: ElistSubscribeComponent,
          //   data: { isPublic: true },
          // },
        ],
      },
      {
        path: ':id/edit',
        component: ElistsFormComponent,
      },
    ],
  },
];
