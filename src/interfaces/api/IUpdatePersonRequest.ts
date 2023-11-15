import { IPerson } from '../data/IPerson';

export interface IUpdatePersonRequest {
  person: Partial<IPerson>;
}
