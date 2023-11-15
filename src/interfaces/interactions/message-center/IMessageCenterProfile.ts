import { IMessageCenterFormData } from './IMessageCenterFormData';

export interface IMessageCenterProfile {
  request: boolean;
  require: boolean;
  initial: IMessageCenterFormData;
  edit: IMessageCenterFormData;
}
