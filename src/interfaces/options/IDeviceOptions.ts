import { RequestCallback } from '../api/RequestCallback';

export interface IDeviceOptions {
  success?: RequestCallback;
  failure?: () => void;
}
