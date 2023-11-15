import { RequestCallback } from '../api/RequestCallback';

export interface IUpdatePersonOptions {
  success?: RequestCallback;
  failure?: () => void;
}
