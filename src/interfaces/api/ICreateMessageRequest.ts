import { IMessage } from '../data/IMessage';

interface ICreateMessageData extends IMessage {
  client_created_at: number;
  client_created_at_utc_offset: number;
  hidden: boolean;
  nonce: string;
  session_id: string;
  type: string;
}

export interface ICreateMessageRequest {
  message: ICreateMessageData;
}
