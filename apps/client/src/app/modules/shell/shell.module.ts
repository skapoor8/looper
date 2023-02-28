import { NgModule } from '@angular/core';
import { UsersModule } from '../users/users.module';
import { ShellHeaderComponent } from './components';

@NgModule({
  imports: [ShellHeaderComponent],
  exports: [ShellHeaderComponent],
})
export class ShellModule {}
