import { IApptentiveLegacySettings } from './IApptentiveLegacySettings';
import { IInteraction } from '../manifest/IInteraction';
import { ITargetedEvents } from '../manifest/ITargetedEvents';

export interface IApptentiveSdkOptions {
  [key: string]: any;
  apiVersion: number;
  captureDisabled: boolean;
  customStyles: boolean;
  db: any;
  debug: boolean;
  domNode: string;
  force_refresh: boolean;
  id: string;
  host: string;
  interactions: IInteraction[];
  readOnly: boolean;
  settings: IApptentiveLegacySettings;
  skipStyles: boolean;
  targeted_events: ITargetedEvents;
  token: string;
}
