import { NgModule } from '@angular/core';
import { UserSelectorComponent } from './components/user-selector.component';
import { UsersPresenter } from './presenters/users.presenter';

@NgModule({
  imports: [UserSelectorComponent],
  exports: [UserSelectorComponent],
  providers: [UsersPresenter],
})
export class UsersModule {}
