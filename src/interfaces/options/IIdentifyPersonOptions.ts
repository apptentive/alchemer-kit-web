import { RequestCallback } from '../api/RequestCallback';
import { IPerson } from '../data/IPerson';

export interface IIdentifyPersonOptions extends IPerson {
  unique_token: string;
  success?: RequestCallback;
  failure?: () => void;
}
