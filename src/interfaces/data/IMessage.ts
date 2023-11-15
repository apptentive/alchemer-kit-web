export interface IMessage {
  body: string;
  custom_data?: {
    [key: string]: any;
  };
}
