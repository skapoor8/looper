import { NgModule } from '@angular/core';
import { ElistListComponent } from './components/elists-list.component';
import { ElistsPresenter } from './presenters';

@NgModule({
  imports: [ElistListComponent],
  exports: [ElistListComponent],
  providers: [],
})
export class ElistModule {}
