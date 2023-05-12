import { Injectable } from '@angular/core';
import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import {
  IElist,
  IElistNew,
  IElistWithOwnerInfoDTO,
  ISubscription,
  ISubscriptionNew,
  ISubscriptionWithElistInfoDTO,
  IUser,
} from '@gcloud-function-api-auth/interfaces';

@Injectable()
export class SubscriptionsHttpService {
  constructor(private _http: HttpClient) {}

  public createSubscription(aSub: ISubscriptionNew) {
    return this._http.post<ISubscription>('subscriptions', aSub);
  }

  public getSubscriptionsForElist(elistId: string) {
    return this._http.get<ISubscription[]>(`elists/${elistId}/subscriptions`);
  }

  public getSubscriptionByEmail(email: string) {
    return this._http.get<ISubscriptionWithElistInfoDTO[]>(
      `subscriptions?email=${email}`
    );
  }

  public getSubscriptionById(subId: string) {
    return this._http.get<ISubscriptionWithElistInfoDTO>(
      `subscriptions/${subId}`
    );
  }

  public updateSubscription(sub: ISubscription) {
    return this._http.put(`subscriptions/${sub.id}`, sub);
  }
}
