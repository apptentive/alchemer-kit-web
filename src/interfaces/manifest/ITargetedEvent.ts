import { ICriteria } from '../engine/ICriteria';

export interface ITargetedEvent {
  interaction_id: string;
  criteria: ICriteria;
}
