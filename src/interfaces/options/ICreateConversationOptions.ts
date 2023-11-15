import { ICreateConversationRequest } from '../api/ICreateConversationRequest';
import { RequestCallback } from '../api/RequestCallback';

export interface ICreateConversationOptions
  extends Pick<ICreateConversationRequest, 'app_release' | 'person' | 'device'> {
  success: RequestCallback;
  failure: () => void;
}
