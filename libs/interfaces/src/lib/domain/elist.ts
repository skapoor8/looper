import { IElistPreference } from './elist-preference';
export interface IElist {
  id: string;
  elistName: string;
  settings?: IElistPreference[];
  defaultSettings?: object;
  ownerId: string;
}

export type IElistNew = Omit<IElist, 'id'>;
