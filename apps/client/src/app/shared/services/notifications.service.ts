import { Injectable, NgModule } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable()
export class NotificationsService {
  constructor(private _snack: MatSnackBar) {}

  public add(message: string, severity: string) {
    let panelClass = '';
    switch (severity) {
      case 'error':
        panelClass = 'notification-error';
        break;
      case 'warn':
        panelClass = 'notification-warn';
        break;
      case 'info':
        panelClass = 'notification-info';
        break;
      case 'success':
        panelClass = 'notification-success';
        break;
    }

    this._snack.open(message, 'Dismiss', {
      panelClass,
    });
  }

  public dismiss() {
    this._snack.dismiss();
  }

  public error(message: string) {
    this.add(message, 'error');
  }

  public warn(message: string) {
    this.add(message, 'warn');
  }

  public info(message: string) {
    this.add(message, 'info');
  }

  public success(message: string) {
    this.add(message, 'success');
  }
}

@NgModule({
  imports: [MatSnackBarModule],
  providers: [NotificationsService],
})
export class NotificationsServiceModule {}
