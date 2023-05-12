import { ISubscriptionNew } from '@gcloud-function-api-auth/interfaces';
import { IsNotEmpty } from 'class-validator';

export class SubscriptionNewModel implements ISubscriptionNew {
  @IsNotEmpty()
  firstName?: string | undefined;

  @IsNotEmpty()
  lastName?: string | undefined;

  @IsNotEmpty()
  email: string;

  company?: string | undefined = '';
  phoneNumber?: string | undefined = '';
  phoneCountryCode?: string | undefined = '';
  userDidConsent = true;
  settings?: object | undefined = {};
  elistId: string;
  isActive = true;
}
