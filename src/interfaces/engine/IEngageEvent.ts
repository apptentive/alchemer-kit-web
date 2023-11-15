export interface IEngageEvent {
  label: string;
  nonce: string;
  client_created_at: number;
  client_created_at_utc_offset: number;
  session_id: string;
  interaction_id?: string;
  data?: {
    [key: string]: any;
  };
}
