import { NgModule } from '@angular/core';
import { DomainServicesModule } from '../../domain-services/domain-services.module';
import { UserSelectorComponent } from './components/user-selector.component';
import { UsersPresenter } from './presenters/users.presenter';

@NgModule({
  imports: [DomainServicesModule, UserSelectorComponent],
  exports: [UserSelectorComponent],
  providers: [UsersPresenter],
})
export class UsersModule {}
