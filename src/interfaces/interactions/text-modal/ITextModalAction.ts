import { ITextModalActionInvoke } from './ITextModalActionInvoke';

export interface ITextModalAction {
  id: string;
  action: string;
  label: string;
  invokes?: ITextModalActionInvoke[];
}
