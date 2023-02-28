export interface IElist {
  id: string;
  elistName: string;
  settings?: object;
  defaultSettings?: object;
  ownerId: string;
}

export type IElistNew = Omit<IElist, 'id'>;
