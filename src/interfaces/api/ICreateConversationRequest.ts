import { IAppRelease } from '../data/IAppRelease';
import { IDevice } from '../data/IDevice';
import { IPerson } from '../data/IPerson';
import { ISdkMetadata } from '../data/ISdkMetadata';

export interface ICreateConversationRequest {
  app_release: IAppRelease;
  device: IDevice;
  person?: IPerson;
  sdk: ISdkMetadata;
  session_id: string;
}
