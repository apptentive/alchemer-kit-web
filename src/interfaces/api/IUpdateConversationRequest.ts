import { IConversation } from '../data/IConversation';

export type IUpdateConversationRequest = Pick<IConversation, 'id' | 'sdk' | 'app_release'>;
