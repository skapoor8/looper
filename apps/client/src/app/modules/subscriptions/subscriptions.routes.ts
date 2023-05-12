import { SubscriptionsManagePreferencesComponent } from './components/subscriptions-manage-preferences.component';
import { Route } from '@angular/router';
import { SubscriptionsManageComponent } from './components/subscriptions-manage.component';
import {
  SubscriptionsFindComponent,
  SubscriptionsManageUserInfoComponent,
} from './components';
import { SubscriptionsMiniAppComponent } from './components/subscriptions-mini-app.component';

export const routes: Route[] = [
  {
    path: 'manage',
    component: SubscriptionsFindComponent,
  },
  {
    path: ':id',
    component: SubscriptionsMiniAppComponent,
    children: [
      {
        path: '',
        component: SubscriptionsManageComponent,
      },
      {
        path: 'user-info',
        component: SubscriptionsManageUserInfoComponent,
      },
      {
        path: 'preferences',
        component: SubscriptionsManagePreferencesComponent,
      },
      {
        path: '**',
        redirectTo: '..',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/elists',
  },
];
