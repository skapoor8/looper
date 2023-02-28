import { NgModule } from '@angular/core';
import { ElistsHttpService } from './elists.http-service';
import { UsersHttpService } from './users.http-service';

@NgModule({
  providers: [UsersHttpService, ElistsHttpService],
})
export class HttpServicesModule {}
