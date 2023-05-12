import {
  ElistPreferenceType,
  IElistPreference,
} from '@gcloud-function-api-auth/interfaces';
import { IsOptional } from 'class-validator';

export class ElistPreferenceModel implements IElistPreference {
  type: ElistPreferenceType;
  prompt: string;
  required = false;

  @IsOptional()
  choices?: string[];
}
