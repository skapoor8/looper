import { Route } from '@angular/router';
import { ElistDetailComponent } from './components/elists-detail.component';
import { ElistsFormComponent } from './components/elists-form.component';
import { ElistListComponent } from './components/elists-list.component';

export const routes: Route[] = [
  {
    path: '',
    component: ElistListComponent,
    // children: [
    //   {
    //     path: 'create',
    //     component: ElistsFormComponent,
    //   },
    //   {
    //     path: ':id',
    //     component: ElistDetailComponent,
    //   },
    // ],
  },
  {
    path: 'create',
    component: ElistsFormComponent,
  },
  {
    path: ':id',
    component: ElistDetailComponent,
  },
  {
    path: ':id/edit',
    component: ElistsFormComponent,
  },
];
