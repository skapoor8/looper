import { AppLoginComponent } from './app-login.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APIInterceptor } from './shared/interceptors/api.interceptor';
import { ShellModule } from './modules/shell/shell.module';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ClassValidatorFormBuilderModule } from 'ngx-reactive-form-class-validator';
import { environment } from '../environments/environment';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { IsLoggedInGuard, IsNotLoggedInGuard } from './modules/shell';
import { DomainServicesModule } from './domain-services';
import { NotificationsService, NotificationsServiceModule } from './shared';
import { ElistModule } from './modules/elists';

@NgModule({
  declarations: [AppComponent, AppLoginComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: environment.isProduction
        ? NgxLoggerLevel.ERROR
        : NgxLoggerLevel.DEBUG,
      enableSourceMaps: !environment.isProduction,
    }),
    ClassValidatorFormBuilderModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot({
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    }),
    // domain service
    DomainServicesModule, // could be a good idea to have a wrapper "FeatureModule" to inject this (this will prevent ui module from accessing domain data)
    // features
    ShellModule,
    ElistModule,
    // ui
    MatToolbarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    IsLoggedInGuard,
    IsNotLoggedInGuard,
    NotificationsServiceModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
