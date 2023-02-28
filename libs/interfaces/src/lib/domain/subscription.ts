export interface ISubscription {
  id: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  email: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  userDidConsent: boolean;
  settings?: object;
  elistId: string;
}
