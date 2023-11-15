import { IMessageCenterAutomatedMessage } from './message-center/IMessageCenterAutomatedMessage';
import { IMessageCenterComposer } from './message-center/IMessageCenterComposer';
import { IMessageCenterErrorMessages } from './message-center/IMessageCenterErrorMessages';
import { IMessageCenterGreeting } from './message-center/IMessageCenterGreeting';
import { IMessageCenterProfile } from './message-center/IMessageCenterProfile';
import { IMessageCenterStatus } from './message-center/IMessageCenterStatus';

export interface IMessageCenterConfiguration {
  title: string;
  composer: IMessageCenterComposer;
  greeting: IMessageCenterGreeting;
  status: IMessageCenterStatus;
  automated_message: IMessageCenterAutomatedMessage;
  error_messages: IMessageCenterErrorMessages;
  profile: IMessageCenterProfile;
  position: string;
}
