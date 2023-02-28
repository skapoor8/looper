import { IElist, IElistNew } from '@gcloud-function-api-auth/interfaces';
import { IsDefined, MaxLength, IsNotEmpty } from 'class-validator';

export class ElistNewModel implements IElistNew {
  @IsNotEmpty()
  @MaxLength(30, {
    message: 'Elist name must be shorter than 30 characters',
  })
  elistName: string;

  settings?: object | undefined;

  defaultSettings?: object | undefined;

  @IsNotEmpty()
  ownerId: string;
}

export class ElistModel extends ElistNewModel implements IElist {
  @IsNotEmpty()
  id: string;
}
