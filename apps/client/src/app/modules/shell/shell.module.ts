import { ShellLoginComponent } from './components/login.component';
import { FirebaseUIModule } from 'firebaseui-angular';
import { NgModule } from '@angular/core';
import { UsersModule } from '../users/users.module';
import { ShellHeaderComponent, ShellMiniAppComponent } from './components';

@NgModule({
  imports: [
    ShellHeaderComponent,
    ShellMiniAppComponent,
    ShellLoginComponent,
    FirebaseUIModule,
  ],
  exports: [ShellHeaderComponent],
})
export class ShellModule {}
