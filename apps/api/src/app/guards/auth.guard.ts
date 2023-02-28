import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IApiAuthStatus, UserRole } from '@gcloud-function-api-auth/interfaces';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLE_KEY } from '../decorators/role.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _reflector: Reflector,
    private _config: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authStatus: IApiAuthStatus = request['auth'];
    const looperApiKey = request['looperApiKey'];
    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const role: UserRole = this._reflector.get<UserRole>(
      ROLE_KEY,
      context.getHandler()
    );
    if (isPublic) {
      return true;
    } else if (authStatus?.authSuccess) {
      console.log('user:', authStatus);
      if (role === UserRole.ADMIN && authStatus.userRole !== UserRole.ADMIN) {
        throw new UnauthorizedException('Insufficient Permissions');
      }
      return true;
    } else if (looperApiKey) {
      console.log('looperApiKey:', looperApiKey);
      if (this._config.get('LOOPER_API_KEY') === looperApiKey) {
        return true;
      } else {
        throw new UnauthorizedException('Invalid Looper API Key');
      }
    } else {
      throw new UnauthorizedException('Forbidden');
    }
  }
}
