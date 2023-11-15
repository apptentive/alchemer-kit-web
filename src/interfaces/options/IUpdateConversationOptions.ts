import { ICreateConversationRequest } from '../api/ICreateConversationRequest';
import { IConversationResponse } from '../api/IConversationResponse';
import { RequestCallback } from '../api/RequestCallback';

export interface IUpdateConversationOptions extends Pick<ICreateConversationRequest, 'app_release'> {
  success?: RequestCallback<IConversationResponse>;
  failure?: () => void;
}
