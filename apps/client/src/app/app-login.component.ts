import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  template: `
    <div class="flex flex-col h-screen justify-center bg-matDeepPurple-400">
      <firebase-ui></firebase-ui>
    </div>
  `,
})
export class AppLoginComponent {}
