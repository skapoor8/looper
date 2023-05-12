import { Route } from '@angular/router';
import { UserAcountComponent } from './modules/users/components/user-account.component';
import {
  redirectUnauthorizedTo,
  canActivate,
  AuthPipe,
  AuthPipeGenerator,
} from '@angular/fire/auth-guard';
import {
  ShellLoginComponent,
  ShellMiniAppComponent,
} from './modules/shell/components';
import { AppLoginComponent } from './app-login.component';
import { IsLoggedInGuard, IsNotLoggedInGuard } from './modules/shell';

const authPipeGenerator: AuthPipeGenerator = () =>
  redirectUnauthorizedTo(['/login']);

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: ShellLoginComponent,
    canActivate: [IsNotLoggedInGuard],
  },
  {
    path: '',
    component: ShellMiniAppComponent,
    children: [
      {
        path: '',
        redirectTo: 'elists',
        pathMatch: 'full',
      },
      {
        path: 'elists',
        loadChildren: () =>
          import('./modules/elists/elist.routes').then((mod) => mod.routes),
        // data: { authGuardPipe: redirectToLogin },
        // ...canActivate(authPipeGenerator),
      },
      {
        path: 'subscriptions',
        loadChildren: () =>
          import('./modules/subscriptions/subscriptions.routes').then(
            (mod) => mod.routes
          ),
      },
      {
        path: 'account',
        component: UserAcountComponent,
        // data: { authGuardPipe: authPipeGenerator },
        // ...canActivate(authPipeGenerator),
        canActivate: [IsLoggedInGuard],
      },
      { path: '**', redirectTo: 'elists', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/elists', pathMatch: 'full' },
];
