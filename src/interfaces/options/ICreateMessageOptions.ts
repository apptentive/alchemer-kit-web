import { IErrorResponse } from '../api/IErrorResponse';
import { RequestCallback } from '../api/RequestCallback';
import { IMessage } from '../data/IMessage';

export interface ICreateMessageOptions extends IMessage {
  success?: RequestCallback;
  failure?: (error: IErrorResponse) => void;
}
