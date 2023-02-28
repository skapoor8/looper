import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private _authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const looperApiKey = req.headers['X-Looper-Api-Key'.toLowerCase()];
    console.log('apiKey:', looperApiKey, req.headers);

    if (looperApiKey) {
      req['looperApiKey'] = looperApiKey;
    } else {
      const token = req.headers.authorization;
      try {
        const authState = await this._authService.validateUser(
          token?.replace('Bearer ', '') ?? ''
        );
        console.log('AuthState:', authState);
        req['auth'] = authState;
      } catch (e) {
        console.error(e);
      }
    }

    next();
  }
}
