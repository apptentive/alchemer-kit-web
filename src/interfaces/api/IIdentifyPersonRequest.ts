import { IPerson } from '../data/IPerson';

interface PersonData extends Partial<IPerson> {
  secret: string;
}

export interface IIdentifyPersonRequest {
  person: PersonData;
}
