import { ISerializedAnswers } from '../interactions/survey/answers/ISerializedAnswers';

interface ISurveyResponseData {
  nonce: string;
  client_created_at: number;
  client_created_at_utc_offset: number;
  id: string;
  answers: ISerializedAnswers;
}

export interface ISubmitSurveyRequest {
  response: ISurveyResponseData;
  session_id: string;
}
