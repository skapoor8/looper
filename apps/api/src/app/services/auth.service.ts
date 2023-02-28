import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ApiUnauthorizedError } from '../errors';
import {
  IApiAuthStatus,
  ApiAuthError,
} from '@gcloud-function-api-auth/interfaces';

@Injectable()
export class AuthService {
  private _app: admin.app.App;

  constructor(private _config: ConfigService) {
    const isLocal = this._config.get('ENVIRONMENT') === 'local';
    if (isLocal) {
      this._app = admin.initializeApp({
        credential: admin.credential.cert(
          this._config.get('GOOGLE_APPLICATION_CREDENTIALS')
        ),
      });
    } else {
      this._app = admin.initializeApp();
    }
  }

  public async validateUser(idToken: string = '') {
    try {
      const decoded = await this._app.auth().verifyIdToken(idToken);
      const status: IApiAuthStatus = {
        authSuccess: true,
        userId: decoded['looper_user_id'],
        userRole: decoded['looper_user_role'],
      };
      return status;
    } catch (e) {
      const status: IApiAuthStatus = {
        authSuccess: false,
        authErrorType: ApiAuthError.UNAUTHORIZED,
      };
      return status;
    }
  }
}
