import { Injectable } from '@angular/core';
import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import {
  IElist,
  IElistNew,
  IElistWithOwnerInfoDTO,
  IUser,
} from '@gcloud-function-api-auth/interfaces';

@Injectable()
export class ElistsHttpService {
  constructor(private _http: HttpClient) {}

  public createElist(anElist: IElistNew) {
    return this._http.post<IElist>('elists', anElist);
  }

  public getElists() {
    return this._http.get<IElistWithOwnerInfoDTO[]>('elists');
  }

  public updateElist(anElist: IElist) {
    return this._http.put(`elists/${anElist.id}`, anElist);
  }

  public deleteElist(elistId: string) {
    return this._http.delete(`elists/${elistId}`);
  }
}
