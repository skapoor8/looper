import {
  IElist,
  ElistPreferenceType,
} from '@gcloud-function-api-auth/interfaces';

export interface IElistPreference {
  type: ElistPreferenceType;
  prompt: string;
  required: boolean;
  choices?: string[];
}

// export interface IElistPreferenceChoice {
//   value: boolean | string;
//   label: string;
// }

// export interface IElistPreferenceBoolean extends IElistPreferenceCommon {
//   type: ElistPreferenceType.BOOLEAN;
//   choices: ['true', 'false'];
// }

// export interface IElistPreferenceChoice extends IElistPreferenceCommon {
//   type: ElistPreferenceType.CHECKBOX | ElistPreferenceType.RADIO;
//   choices: string[];
// }

// export type IElistPreference = IElistPreferenceBoolean | IElistPreferenceChoice;
