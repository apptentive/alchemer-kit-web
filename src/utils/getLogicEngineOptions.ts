import type Fifo from 'localstorage-fifo';
import type ApptentiveBase from '../base';
import buildDeviceMetadata from './buildDeviceMetadata';
import { IDevice } from '../interfaces/data/IDevice';
import { IPerson } from '../interfaces/data/IPerson';
import { ILogicEngineOptions } from '../logic-engine';

const parseStringObject = <T>(input: string | object | undefined, logger: ApptentiveBase['console']): T => {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input) as T;
    } catch (error) {
      logger('error', error);
      return {} as T;
    }
  }

  return input as T;
};

const getLogicEngineOptions = (
  ignoreLocalStorage: boolean,
  db: Fifo,
  logger: ApptentiveBase['console']
): Partial<ILogicEngineOptions> => {
  if (ignoreLocalStorage) {
    logger('info', 'Ignoring localStorage because of force_refresh option.');
    return {
      code_point: {},
      interaction_counts: {},
      device: {} as IDevice,
      person: {} as IPerson,
      random: {},
    } as Partial<ILogicEngineOptions>;
  }

  logger('info', 'Loading Apptentive Data from localStorage.');
  return {
    code_point: db.get('code_point') || {},
    interaction_counts: db.get('interaction_counts') || {},
    device: parseStringObject<IDevice>(db.get('device'), logger) || buildDeviceMetadata(),
    person: parseStringObject<IPerson>(db.get('person'), logger) || {},
    random: db.get('random') || {},
  } as Partial<ILogicEngineOptions>;
};

export default getLogicEngineOptions;
