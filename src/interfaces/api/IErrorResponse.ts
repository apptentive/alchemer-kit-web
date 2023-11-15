import { HTTPError } from 'ky';

export interface IErrorResponse extends HTTPError {
  responseText?: string; // JSON string
}
