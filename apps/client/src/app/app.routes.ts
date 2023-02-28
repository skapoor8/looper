import { Route } from '@angular/router';
import { UserAcountComponent } from './modules/users/components/user-account.component';

export const appRoutes: Route[] = [
  {
    path: 'elists',
    loadChildren: () =>
      import('./modules/elists/elist.routes').then((mod) => mod.routes),
  },
  {
    path: 'account',
    component: UserAcountComponent,
    // loadComponent: () =>
    //   import('./modules/users/components/user-account.component').then(
    //     (mod) => mod.UserAcountComponent
    //   ),
  },
  { path: '**', redirectTo: '/elists', pathMatch: 'full' },
];
