import { IStoreAnswer } from './IStoreAnswer';
import { IStoreInvoke } from './IStoreInvoke';

export interface IStoreData {
  [key: string]: any;
  invokes: IStoreInvoke;
  answers?: IStoreAnswer[];
  last_invoked_at?: number;
  last_submission_at?: number;
}
