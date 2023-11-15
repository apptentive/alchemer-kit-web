import { IAppRelease } from './IAppRelease';
import { IPerson } from './IPerson';
import { ISdkMetadata } from './ISdkMetadata';

export interface IConversation {
  state: 'new';
  id: string;
  device_id: string;
  person_id: string;
  sdk: ISdkMetadata;
  app_release?: IAppRelease;
  token: string;
  person?: IPerson;
}
