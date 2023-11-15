import type ApptentiveBase from '../base';
import { IApptentiveSdkOptions } from '../interfaces/sdk/IApptentiveSdkOptions';

const getLocalSdkOptions = (logger: ApptentiveBase['console']): Partial<IApptentiveSdkOptions> => {
  try {
    const data = window.localStorage.getItem('ApptentiveSDKOptions');

    if (data) {
      return JSON.parse(data) as Partial<IApptentiveSdkOptions>;
    }
  } catch (error) {
    logger('error', error);
  }

  return {} as Partial<IApptentiveSdkOptions>;
};

export default getLocalSdkOptions;
