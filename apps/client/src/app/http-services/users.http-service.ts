import { Injectable } from '@angular/core';
import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import {
  IElist,
  IElistWithOwnerInfoDTO,
  IUser,
} from '@gcloud-function-api-auth/interfaces';

@Injectable()
export class UsersHttpService {
  constructor(private _http: HttpClient) {}

  public getUserByUid(uid: string) {
    return this._http.get<IUser>(`users/uid/${uid}`);
  }

  public getUserById(id: string) {
    return this._http.get<IUser>(`users/${id}`);
  }

  public getUsers() {
    return this._http.get<IUser[]>('users');
  }

  public getUserElists(userId: string) {
    return this._http.get<IElist[]>(`users/${userId}/elists`);
  }
}
