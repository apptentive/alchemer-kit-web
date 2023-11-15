import { IApptentiveSdkOptions } from './IApptentiveSdkOptions';
import { IInteraction } from '../manifest/IInteraction';
import { ITargetedEvents } from '../manifest/ITargetedEvents';

// Essentially the SDK init options require these three params, but all others are optional
export interface ISdkInitOptions extends Partial<IApptentiveSdkOptions> {
  interactions: IInteraction[];
  targeted_events: ITargetedEvents;
  token: string;
}
