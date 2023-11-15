import { ITextModalAction } from './text-modal/ITextModalAction';

export interface ITextModalConfiguration {
  title: string;
  body: string;
  name: string;
  actions: ITextModalAction[];
  position: string;
}
