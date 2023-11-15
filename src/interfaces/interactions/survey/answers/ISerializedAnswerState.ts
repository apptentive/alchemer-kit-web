import { ISerializedAnswer } from './ISerializedAnswer';

export interface ISerializedAnswerState {
  state: 'empty' | 'answered' | 'skipped';
  value?: ISerializedAnswer[];
}
