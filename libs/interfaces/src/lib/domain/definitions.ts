import { IElistPreference } from './elist-preference';
import { ElistPreferenceType } from './enums';

export const ElistPreferenceDefinitions: IElistPreference[] = [
  {
    type: ElistPreferenceType.BOOLEAN,
    prompt: 'Example boolean prompt',
    required: false,
  },
  {
    type: ElistPreferenceType.CHECKBOX,
    prompt: 'Example checkbox prompt',
    required: false,
    choices: ['A', 'B', 'C'],
  },
  {
    type: ElistPreferenceType.RADIO,
    prompt: 'Example radio prompt',
    required: false,
    choices: ['A', 'B', 'C'],
  },
];
