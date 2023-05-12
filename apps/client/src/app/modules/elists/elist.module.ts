import { ElistDetailComponent } from './components/elists-detail.component';
import { NgModule } from '@angular/core';
import { ElistListComponent } from './components/elists-list.component';
import { ElistsPresenter } from './presenters';
import { ElistMiniAppComponent } from './components';
import { ElistDetailSettingsComponent } from './components/elist-detail-settings.component';

@NgModule({
  imports: [
    ElistListComponent,
    ElistMiniAppComponent,
    ElistDetailComponent,
    ElistDetailSettingsComponent,
  ],
  exports: [ElistListComponent],
  providers: [],
})
export class ElistModule {}
