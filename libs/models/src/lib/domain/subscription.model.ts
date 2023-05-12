import { ISubscriptionWithElistInfoDTO } from './../../../../interfaces/src/lib/dto/subscription-with-elist-info.dto';
import { IElist, ISubscription } from '@gcloud-function-api-auth/interfaces';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SubscriptionModel implements ISubscription {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  firstName?: string | undefined;

  @IsNotEmpty()
  lastName?: string | undefined;

  @IsNotEmpty()
  company?: string | undefined;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  phoneNumber?: string | undefined = '';

  @IsOptional()
  phoneCountryCode?: string | undefined = '';

  userDidConsent = true;

  @IsNotEmpty()
  settings?: object | undefined = {};

  @IsNotEmpty()
  elistId: string;

  @IsNotEmpty()
  isActive: boolean;

  static createNew() {
    return new SubscriptionModel();
  }

  static fromObject(obj: ISubscription) {
    const instance = new SubscriptionModel();
    Object.assign(instance, obj);
    return instance;
  }

  static fromSubscriptionWithElistInfoDTO(obj: ISubscriptionWithElistInfoDTO) {
    const temp: Omit<ISubscriptionWithElistInfoDTO, 'elist'> & {
      elist?: Pick<IElist, 'id' | 'elistName'>;
    } = { ...obj };
    delete temp.elist;
    const sub: ISubscription = {
      ...temp,
      elistId: obj.elist.id,
    };
    return SubscriptionModel.fromObject(sub);
  }

  toObject(): ISubscription {
    const { ...obj } = this;
    return obj;
  }
}
