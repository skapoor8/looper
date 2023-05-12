import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUIModule } from 'firebaseui-angular';

@Component({
  selector: 'looper-shell-login',
  standalone: true,
  imports: [FirebaseUIModule],
  template: `
    <div class="flex flex-col h-screen justify-center bg-matDeepPurple-400">
      <firebase-ui
        (signInSuccessWithAuthResult)="handleSignInSuccess()"
      ></firebase-ui>
    </div>
  `,
})
export class ShellLoginComponent {
  constructor(private _router: Router) {}

  handleSignInSuccess() {
    this._router.navigateByUrl('/elists');
  }
}
