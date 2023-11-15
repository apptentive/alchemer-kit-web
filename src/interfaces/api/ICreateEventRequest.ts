import { IEngageEventCustomData } from '../engine/IEngageEventCustomData';

interface IEventData {
  client_created_at: number;
  client_created_at_utc_offset: number;
  data?: IEngageEventCustomData;
  interaction_id?: string;
  label: string;
  nonce: string;
  session_id: string;
}

export interface ICreateEventRequest {
  event: IEventData;
}
