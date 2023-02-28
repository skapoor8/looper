import { NgModule } from '@angular/core';
import { HttpServicesModule } from '../http-services';
import { StoresModule } from '../stores';
import { ElistsDomainService } from './services/elists.domain-service';
import { UsersDomainService } from './services/users.domain-service';

@NgModule({
  imports: [HttpServicesModule, StoresModule],
  providers: [UsersDomainService, ElistsDomainService],
})
export class DomainServicesModule {}
