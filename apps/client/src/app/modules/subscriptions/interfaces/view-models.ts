import { DomainServiceLoadableStatus } from './../../../domain-services/enums';
export interface ISubscriptionManagerOverviewVM {
  isLoading: boolean;
  elistName: string;
  subscriberName: string;
  isSubscriptionActive: boolean;
}

export interface ISubscriptionFindVM {
  elistName: string;
  elistId: string;
  email: string;
  elistFound: DomainServiceLoadableStatus;
  subscriptionFound: DomainServiceLoadableStatus;
}
