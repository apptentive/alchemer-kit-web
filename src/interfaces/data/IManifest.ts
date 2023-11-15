import { IInteraction } from '../manifest/IInteraction';
import { ITargetedEvents } from '../manifest/ITargetedEvents';

export interface IManifest {
  interactions: IInteraction[];
  targets: ITargetedEvents;
}
