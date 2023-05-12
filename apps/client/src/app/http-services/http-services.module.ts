import { SubscriptionsHttpService } from './subscriptions.http-service';
import { NgModule } from '@angular/core';
import { ElistsHttpService } from './elists.http-service';
import { UsersHttpService } from './users.http-service';

@NgModule({
  providers: [UsersHttpService, ElistsHttpService, SubscriptionsHttpService],
})
export class HttpServicesModule {}
