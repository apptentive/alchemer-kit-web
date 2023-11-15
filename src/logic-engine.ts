import events from './constants/events';

import type ApptentiveBase from './base';
import { ICriteria } from './interfaces/engine/ICriteria';
import { IDevice } from './interfaces/data/IDevice';
import { IInteraction } from './interfaces/manifest/IInteraction';
import { IPerson } from './interfaces/data/IPerson';
import { IStore } from './interfaces/store/IStore';
import { IStoreData } from './interfaces/store/IStoreData';
import { IStoreNoteResponse } from './interfaces/store/IStoreNoteResponse';
import { IStoreSurveyResponse } from './interfaces/store/IStoreSurveyResponse';
import { ITargetedEvents } from './interfaces/manifest/ITargetedEvents';
import { ITargetedEvent } from './interfaces/manifest/ITargetedEvent';

export interface ILogicEngineOptions {
  debug: boolean;
  code_point: IStore;
  person: IPerson;
  device: IDevice;
  interaction_counts: IStore;
  random: object;
  interactions: IInteraction[];
  targeted_events: ITargetedEvents;
  console: ApptentiveBase['console'];
}

/**
 * The Logic Engine for handling Apptentive criteria.
 * @property {object} code_point Code Points
 * @property {object} interaction_counts Interaction Counts
 * @property {object} random Randomness Storage
 * @property {object} person Person Meta Data
 * @property {object} device Device Meta Data
 * @property {object} application Application Meta Data
 * @property {object[]} interactions Interactions
 * @property {object} targeted_events Targeted Events
 * @property {object} time_at_install Time At Install Data
 * @property {Function} console Console Ouput
 */
export default class LogicEngine {
  public debug: boolean;
  public code_point: IStore;
  public interaction_counts: IStore;
  public random: { [key: string]: any };
  public device: IDevice;
  public person: IPerson;
  public interactions: IInteraction[];
  public targeted_events: ITargetedEvents;
  public console: ApptentiveBase['console'];
  /**
   * Creates a new LogicEngine.
   * @param {object} [options] Options for priming the new LogicEngine instance.
   * @param {boolean} [options.debug] - Enable debugging mode.
   * @param {object} [options.code_point] Code Points
   * @param {object} [options.person] Person Meta Data
   * @param {object} [options.device] Device Meta Data
   * @param {object} [options.interaction_counts] Interaction Counts
   * @param {object} [options.random] Randomness Storage
   * @param {object[]} [options.interactions] Interactions
   * @param {object} [options.targeted_events] Targeted Events
   * @param {Function} [options.console] Console Ouput
   * @class
   */
  constructor(options: Partial<ILogicEngineOptions> = {}) {
    this.debug = options.debug || false;
    this.code_point = options.code_point || {};
    this.interaction_counts = options.interaction_counts || {};
    this.random = options.random || {};
    this.device = options.device || ({} as IDevice);
    this.person = options.person || ({} as IPerson);

    this.interactions = options.interactions || [];
    this.targeted_events = options.targeted_events || ({} as ITargetedEvents);

    this.console = options.console ? options.console : () => {};

    this.evaluateConditionalTests = this.evaluateConditionalTests.bind(this);
    this.evaluateConditionalTest = this.evaluateConditionalTest.bind(this);
    this.compare = this.compare.bind(this);
    this.defaultValueForKey = this.defaultValueForKey.bind(this);
    this.valueForKey = this.valueForKey.bind(this);
    this.evaluateCriteriaKeyValue = this.evaluateCriteriaKeyValue.bind(this);
    this.evaluateCriteria = this.evaluateCriteria.bind(this);
    this.targetedInteractionId = this.targetedInteractionId.bind(this);
    this.interactionIdForInvocations = this.interactionIdForInvocations.bind(this);
    this.interactionFromId = this.interactionFromId.bind(this);
    this.interactionFromType = this.interactionFromType.bind(this);
    this.interactionForInvocations = this.interactionForInvocations.bind(this);
    this.canShowInteractionForEvent = this.canShowInteractionForEvent.bind(this);
    this.engageEvent = this.engageEvent.bind(this);
    this.engageCodePoint = this.engageCodePoint.bind(this);
    this.engageInteraction = this.engageInteraction.bind(this);
    this.reset = this.reset.bind(this);
  }

  /**
   * Converts a string in the format of `<major>.<minor>.<patch>` (example: 1.2.3) to an integer for comparison.
   * Where major, minor, and patch (if present) are integers between 0 and 2097151.
   * @param {string} inputVersion - The version to be converted.
   * @static
   * @see http://stackoverflow.com/questions/307179/what-is-javascripts-highest-integer-value-that-a-number-can-go-to-without-losin
   * @returns {number} Version as an integer.
   */
  static toVersion(inputVersion: string) {
    const version = inputVersion.split('.');

    return (
      // eslint-disable-next-line no-bitwise
      (Number.parseInt(version[0], 10) << 20) |
      // eslint-disable-next-line no-bitwise
      (Number.parseInt(version[1], 10) << 10) |
      Number.parseInt(version[2], 10)
    );
  }

  /**
   * Updates the count of seen Interactions and Events for the given item.
   * @static
   * @param {object} store - The storage to update.
   * @param {string} key - The key to use on the storage.
   * @param {boolean} [updateLastInvoked] - Whether or not to update the last invoked timestamp.
   */
  static createOrUpdate(store: IStore, key: string, updateLastInvoked = true) {
    if (store[key] === undefined) {
      store[key] = {
        invokes: {
          total: 0,
          version: 0,
          build: 0,
        },
      };
    }

    store[key].invokes.total++;
    store[key].invokes.version++;
    store[key].invokes.build++;

    if (updateLastInvoked) {
      store[key].last_invoked_at = Date.now();
    }
  }

  /**
   * Updates specific Survey data in the storage for targeting.
   * This will loop over the incoming `answers` data and add it to the internal targeting storage (the provided `store`) in the form of `{ id: 'BSON ID' }` or `{ id: 'BSON ID' , value: 'text input value' }`
   * @static
   * @param {object} store - The storage to update, interaction_counts for Surveys.
   * @param {string} key - The key to use on the storage, the Survey ID.
   * @param {object} data - The Survey event data to add to the storage.
   * @param {object[]} data.answers - The Survey answers data to add to the storage.
   */
  static augmentSurvey(store: IStore, key: string, data: IStoreSurveyResponse) {
    if (store[key] === undefined) {
      store[key] = {} as IStoreData;
    }

    // Basic Meta Data
    store[key].last_submission_at = Date.now();

    // Add Each Question
    if (data && data.answers) {
      Object.keys(data.answers).forEach((id) => {
        // Each `id` is a Question BSON ID
        LogicEngine.createOrUpdate(store, id);
        // If it is already an array we have previous answers, otherwise we need to add the array.
        if (Array.isArray(store[id].answers)) {
          store[id].answers!.push(...data.answers[id]);
        } else {
          store[id].answers = [...data.answers[id]];
        }

        store[id].current_answer = [...data.answers[id]];
      });
    }
  }

  /**
   * Updates specific Note (TextModal) data in the storage for targeting against.
   * This will add the selected Note Action ID (both `key` and `data.id`) and label (`data.label`) into the internal targeting storage (the provided `store`) to be targeted against in the form of `{ id: 'BSON ID' , value: 'Note Action Label' }`.
   * @static
   * @param {object} store - The storage to update, interaction_counts for Notes.
   * @param {string} key - The key to use on the storage, the Note ID.
   * @param {object} data - The Note event data to add to the storage.
   * @param {string} data.action_id - The Note Action BSON ID to add to the storage.
   * @param {string} data.label - The Note Action text displayed to the end user to add to the storage.
   */
  static augmentNote(store: IStore, key: string, data: IStoreNoteResponse) {
    if (store[key] === undefined) {
      store[key] = {} as IStoreData;
    }

    // Basic Meta Data
    store[key].last_submission_at = Date.now();

    // Add Action
    if (data && data.action_id) {
      // If it is already an array we have previous responses, otherwise we need to add the array.
      // Currently Notes can only be seen once, but in the near future this will change.
      const action = {
        id: data.action_id,
        value: data.label || '',
      };
      if (Array.isArray(store[key].answers)) {
        store[key].answers!.push(action);
      } else {
        store[key].answers = [action];
      }
    }
  }

  /**
   * Evaluates a set of tests against a given value.
   * @param {*} value - The value being tested.
   * @param {object} tests - The set of tests to compare the value against.
   * @param {string} key - The key for the type of comparison to be performed.
   * @returns {boolean} Tests pass conditional criteria.
   */
  evaluateConditionalTests(value: any, tests: ICriteria, key: string): boolean {
    this.console('info', 'Evaluate Conditional Tests:', value, tests, key);
    let result = true;

    if (typeof tests === 'object' && tests._type === undefined) {
      const operators = Object.keys(tests);

      for (let i = 0, l = operators.length; i < l; i++) {
        const operator = operators[i];
        result = result && this.evaluateConditionalTest(value, operator, tests[operator], key);
      }
    } else {
      result = this.evaluateConditionalTest(value, '$eq', tests, key);
    }

    return result;
  }

  /**
   * Evaluates a single test against a given value.
   * @param {*} value - The value being tested.
   * @param {string} operator - The type of test being done.
   * @param {*} parameter - The variable to compare against the value.
   * @param {string} [key] - The key for the type of comparison to be performed.
   * @returns {boolean} Test passed the given criteria.
   */
  evaluateConditionalTest(value: any, operator: string, parameter: any, key = '') {
    this.console('info', 'Evaluate Conditional Test:', value, operator, parameter, key);

    const parameterType = typeof parameter;
    const valueType = typeof value;

    let determinedOperator = operator;
    let determinedParameter = parameter;
    let determinedValue = value;

    if (determinedOperator === '$exists') {
      if (parameterType !== 'boolean') {
        this.console('info', 'Evaluate Conditional Test: $exists === false (parameter not boolean)');
        return false;
      }

      let output = determinedValue !== null && valueType !== 'undefined';

      if (Array.isArray(value)) {
        output = determinedValue.length > 0;
      }

      if (typeof determinedValue === 'string' && determinedValue === '') {
        output = false;
      }

      this.console('info', 'Evaluate Conditional Test: $exists ===', output === determinedParameter);
      return output === determinedParameter;
    }

    // Massage / validate parameter and value if necessary
    if (Array.isArray(determinedValue) && determinedValue.length > 0) {
      // We need to loop through the value to see if any match.
      if (key && (key.endsWith('/answers/value') || key.endsWith('/current_answer/value'))) {
        const check = (subValue: any) => {
          if (subValue.value != null) {
            return this.compare(determinedOperator, subValue.value, determinedParameter);
          }
          return false;
        };

        let output = false;
        if (determinedOperator === '$ne') {
          output = determinedValue.every(check);
        } else {
          output = determinedValue.some(check);
        }

        this.console('info', 'Evaluate Conditional Test (answers/value):', output);
        return output;
      }

      if (key && (key.endsWith('/answers/id') || key.endsWith('/current_answer/id'))) {
        if (determinedOperator === '$eq') {
          determinedOperator = '$array_contains';
        }
        if (determinedOperator === '$ne') {
          determinedOperator = '$array_not_contains';
        }
        determinedValue = determinedValue
          .map((subValue) => {
            if (subValue.id) {
              return subValue.id;
            }
            return undefined;
          })
          .filter((id) => id != null);
      } else {
        const firstValueType = typeof determinedValue[0];

        if (firstValueType !== parameterType) {
          this.console(
            'info',
            `Evaluate Conditional Test: false (array index 0 type mismatch: ${firstValueType} !== ${parameterType})`
          );
          return false;
        }
      }
    } else if (parameterType === 'object' && determinedParameter !== null) {
      switch (determinedParameter._type) {
        case 'datetime':
          if (determinedValue === null || valueType !== 'object') {
            this.console('info', 'Evaluate Conditional Test: false (datetime type mismatch)');
            return false;
          }
          determinedParameter = new Date(determinedParameter.sec * 1000);
          break;
        case 'version':
          if (determinedValue === null || determinedValue._type !== 'version' || valueType !== 'object') {
            this.console('info', 'Evaluate Conditional Test: false (version type mismatch)');
            return false;
          }
          determinedParameter = LogicEngine.toVersion(determinedParameter.version);
          determinedValue = LogicEngine.toVersion(determinedValue.version);
          break;
        default:
          this.console('warn', 'Unknown Logic Parameter Type:', determinedParameter._type);
          return false;
      }
    } else if (determinedOperator === '$before' || determinedOperator === '$after') {
      if (parameterType !== 'number' || determinedValue === null) {
        this.console('info', 'Evaluate Conditional Test: false ($before/$after type mismatch)');
        return false;
      }
      determinedParameter = new Date(Date.now() + parameter * 1000);
    } else if (parameterType !== valueType) {
      this.console('info', 'Evaluate Conditional Test: false (parameter & value type mismatch)');
      return false;
    } else if (
      (determinedOperator === '$contains' ||
        determinedOperator === '$starts_with' ||
        determinedOperator === '$ends_with') &&
      (valueType !== 'string' || parameterType !== 'string')
    ) {
      this.console('info', 'Evaluate Conditional Test: false (string type mismatch)');
      return false;
    }

    if (!Array.isArray(determinedValue) && parameterType === 'string') {
      determinedValue = determinedValue.toLowerCase().trim();
      determinedParameter = determinedParameter.toLowerCase().trim();
    }

    const output = this.compare(determinedOperator, determinedValue, determinedParameter);
    this.console('info', 'Evaluate Conditional Test:', output);

    return output;
  }

  /**
   * Compares a value against a given parameter using a provided operator.
   * @param {string} operator - The type of test being done.
   * @param {string | number | string[] | number[] | boolean} value - The value being tested.
   * @param {string|number} parameter - The variable to compare against the value.
   * @returns {boolean} Tests passed in value against the parameter.
   */
  compare(operator: string, value: string | number | string[] | number[] | boolean, parameter: string | number) {
    this.console('info', 'Compare:', operator, value, parameter);
    switch (operator) {
      case '$eq':
        return value.valueOf() === parameter.valueOf();
      case '$ne':
        return value.valueOf() !== parameter.valueOf();
      case '$gt':
        return value > parameter;
      case '$lt':
        return value < parameter;
      case '$after':
      case '$gte':
        return value >= parameter;
      case '$before':
      case '$lte':
        return value <= parameter;
      case '$contains':
        if (!parameter) {
          return false;
        }
        return String(value).includes(String(parameter));
      case '$starts_with':
        if (!parameter) {
          return false;
        }
        return String(value).startsWith(String(parameter));
      case '$ends_with':
        if (!parameter) {
          return false;
        }
        return String(value).endsWith(String(parameter));
      case '$array_contains':
        if (Array.isArray(value)) {
          return value.includes(parameter as never);
        }
        this.console('warn', 'Type Mismatch: Not an array', value);
        return false;
      case '$array_not_contains':
        if (Array.isArray(value)) {
          return !value.includes(parameter as never);
        }
        this.console('warn', 'Type Mismatch: Not an array', value);
        return false;
      case '$exists':
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === 'string' && value === '') {
          return false;
        }
        return value != null;
      default:
        this.console('warn', 'Unknown Logic Comparison Type:', operator);
        return false;
    }
  }

  /**
   * Get the default value for a given key.
   * @param {string} key - The key to find the given value of.
   * @returns {string|number|Date|boolean} The default value for a given key, or null when no value can be determined.
   */
  defaultValueForKey(key: string) {
    const parts = key.split('/');
    if (parts[0] === 'random') {
      const value = Number.parseFloat((Math.random() * 100).toFixed(1));
      // If we are not using the shorthand `random/percent`, we are using a key and should store the random value for lookup later.
      if (parts[1] !== 'percent') {
        this.random[parts[1]] = value;
      }
      return value;
    }
    if (parts.length === 4 && (parts[0] === 'interactions' || parts[0] === 'code_point') && parts[2] === 'invokes') {
      this.console('info', `Default Value For Key: "${key}" === 0`);
      return 0;
    }
    if (key === 'current_time') {
      this.console('info', `Default Value For Key: "${key}" === new Date()`);
      return new Date();
    }
    if (key === 'is_update/version') {
      this.console('info', `Default Value For Key: "${key}" === false`);
      return false;
    }
    this.console('info', `Default Value For Key: "${key}" === null`);
    return null;
  }

  /**
   * Get the value for a given key.
   * @param {string} key - The key to find the given value of.
   * @param {?object} store - The optional store to locate the value to compare against.
   * @returns {*} The determined value for the provided key.
   */
  valueForKey(key: string, store?: IStore) {
    this.console('info', `Value For Key: "${key}"`);

    const parts = key.split('/');
    let value;
    let testValue;

    for (let i = 0, l = parts.length; i < l; i++) {
      let part = parts[i].trim();

      if (part === 'interactions') {
        part = 'interaction_counts';
      }

      // There is no "/percent" value for the random value, return the random number directly.
      if (part === 'percent' && i === 2 && value) {
        return value;
      }

      // Special case of keyless random.
      if (part === 'percent' && i === 1) {
        const random = this.defaultValueForKey(key);
        this.console('info', `Value For Key: "${key}" (random/percent)`, random);

        return random;
      }

      if (i === 0) {
        // First loop through should check the internal stores (code_points, interaction_counts, random)
        // Or use the optional external store if passed into the method
        testValue = store || this[part as 'code_point' | 'interaction_counts' | 'random'];
      } else if (value != null) {
        // Every subseqent look will be looking deeper into data.
        testValue = (value as any)[part];
      }

      // There is no "/total" value for the timestamp, return the timestamp directly.
      if ((part === 'last_invoked_at' || part === 'last_submission_at') && testValue) {
        return testValue;
      }

      // `answers` or `current_answer` means we are looking for the value of the Survey Question answer / Note Action ID.
      // Survey Question answers are stored as an array, as some questions can have many answers.
      if (part === 'answers' || part === 'current_answer') {
        this.console('info', `Value For Key: "${key}" (answers)`, testValue);
        return testValue;
      }

      if (testValue === undefined) {
        this.console('info', `Value Missing For Key: "${key}"`);
        return this.defaultValueForKey(key);
      }

      value = testValue;
    }

    this.console('info', `Value For Key: "${key}" ===`, value);
    return value;
  }

  /**
   * Evaluate criteria grouping.
   * @param {string} key - The key for the type of comparison to be performed.
   * @param {*} value - The value used to compare.
   * @param {?object} store - The optional external store to evaluate against
   * @returns {boolean} The determined value for a given key.
   */
  evaluateCriteriaKeyValue(key: string, value: any, store?: IStore): boolean {
    this.console('info', 'Evaluate Criteria Key Value:', key, value);
    let result = true;

    switch (key) {
      case '$and':
        for (let i = 0; i < value.length; i++) {
          result = result && this.evaluateCriteria(value[i], store);
        }
        break;
      case '$or':
        result = false;
        for (let i = 0; i < value.length; i++) {
          result = result || this.evaluateCriteria(value[i], store);
        }
        break;
      case '$not':
        result = !this.evaluateCriteria(Array.isArray(value) ? [value] : value, store);
        break;
      default:
        result = this.evaluateConditionalTests(this.valueForKey(key, store), value, key);
    }

    return result;
  }

  /**
   * Evaluate criteria.
   * @param {object} criteria - The criteria to be tested.
   * @param {?object} store - The optional external store to evaluate against
   * @returns {boolean} The result of the critera being test.
   */
  evaluateCriteria(criteria: ICriteria, store?: IStore) {
    this.console('info', 'Evaluate Criteria:', criteria);
    let result = true;

    const keys = Object.keys(criteria);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      this.console('info', 'Evaluate Criteria at:', i, key);
      result = result && this.evaluateCriteriaKeyValue(key, criteria[key], store);
    }

    this.console('info', 'Evaluated Criteria:', result);
    return result;
  }

  /**
   * Get the first target ID from an Interaction manifest for a given event.
   * @param {string} event - The event to search for in the Interaction manifest.
   * @returns {string} The Interaction ID of the first match, or null if there is no match.
   */
  targetedInteractionId(event: string) {
    this.console('info', 'Targeted Interaction Event:', event);
    return this.interactionIdForInvocations(this.targeted_events[event]);
  }

  /**
   * Get the first target ID from an Interaction manifest for a given event.
   * @param {object[]} potentialTargets - The targets to search for in the Interaction manifest.
   * @returns {string} The Interaction ID of the first match, or null if there is no match.
   */
  interactionIdForInvocations(potentialTargets: ITargetedEvent[]) {
    this.console('info', 'Interaction ID For Invocations:', potentialTargets);
    if (potentialTargets) {
      if (!Array.isArray(potentialTargets)) {
        this.console('error', 'Target Interaction was not an array!');
        return null;
      }

      for (let i = 0, l = potentialTargets.length; i < l; i++) {
        const target = potentialTargets[i];

        if (this.evaluateCriteria(target.criteria)) {
          return target.interaction_id;
        }
      }
    }

    return null;
  }

  /**
   * Get an Interaction from an Interaction ID.
   * @param {string} interactionId - The Interaction ID to search for in the Interaction manifest.
   * @returns {object|null} The Interaction that matches the given ID.
   */
  interactionFromId(interactionId: string | null): IInteraction | null {
    if (interactionId) {
      this.console('info', 'Interaction From ID:', interactionId);

      return this.interactions.find((interaction) => interaction.id === interactionId) || null;
    }

    this.console('info', 'Interaction From ID called without interactionId.');
    return null;
  }

  /**
   * Get Interactions by type.
   * @param {string} type - The Interaction type to search for in the Interaction manifest.
   * @returns {Array} All Interactions that matches the given type.
   */
  interactionFromType(type: string) {
    this.console('info', 'Interaction From Type:', type);

    return this.interactions.filter((interaction) => interaction.type === type);
  }

  /**
   * Returns the first matching interaction from a given collection of invocations, otherwise null.
   * @param {object[]} invocations - The invocations to search through.
   * @returns {object|null} - The interaction
   */
  interactionForInvocations(invocations: ITargetedEvent[]) {
    this.console('info', 'Interaction From Invocations:', invocations);
    return this.interactionFromId(this.interactionIdForInvocations(invocations));
  }

  /**
   * Returns the interaction if it can be shown, otherwise null.
   * @param {string} event - The event to engage.
   * @returns {object|null} - The interaction
   */
  canShowInteractionForEvent(event: string) {
    this.console('info', 'Can Show Interaction for Event:', event);
    return this.interactionFromId(this.targetedInteractionId(event));
  }

  /**
   * Engage an event and an Interaction if needed.
   * @param {string} event - The event to engage.
   * @param {object} eventData - Custom Event Data to help augment logic.
   * @returns {object|null} The Interaction that was a result of the event.
   */
  engageEvent(event: string, eventData?: IStoreNoteResponse | IStoreSurveyResponse) {
    this.console('info', 'Engage Event:', event, eventData);

    // In order for the criteria evaluation to have the correct data, we need to update the event counts without updating the last_invoked_at timestamp
    // This will make sure this event is counted prior to evaluation, and then the timestamp will be updated in the engageCodePoint method
    LogicEngine.createOrUpdate(this.code_point, event, false);

    // Then this method will evaluate the interaction with the updated counts
    const interaction = this.interactionFromId(this.targetedInteractionId(event));
    this.engageCodePoint(event, eventData);

    if (interaction) {
      this.engageInteraction(interaction);
    }

    return interaction;
  }

  /**
   * Update the count of seen events for the given event.
   * @param {string} event - The event to engage.
   * @param {object} eventData - Custom Event Data to help augment logic.
   */
  engageCodePoint(event: string, eventData?: IStoreNoteResponse | IStoreSurveyResponse) {
    this.console('info', 'Update Event Counts:', event, eventData);

    // Update the timestamp of the code_point now that the criteria evaluation has completed
    if (this.code_point[event]) {
      this.code_point[event].last_invoked_at = Date.now();
    }

    switch (event) {
      case events.APPTENTIVE_SURVEY_SUBMIT: {
        if (eventData) {
          this.console('info', 'Adding Survey Answers:', eventData.id, eventData);
          LogicEngine.augmentSurvey(this.interaction_counts, eventData.id, eventData as IStoreSurveyResponse);
        }
        break;
      }

      // Commented out for the time being until we decide on partial answer tracking.
      // If this gets added in the future, it will need to be modified so that it does not double track answers
      // Right now all answers are tracked when a survey is submitted instead of a question set at a time
      // case events.APPTENTIVE_SURVEY_NEXT_QUESTION_SET: {
      //   if (eventData) {
      //     this.console('info', 'Adding QuestionSet Answers:', eventData.id, eventData);
      //     LogicEngine.augmentSurvey(this.interaction_counts, eventData.id, eventData as IStoreSurveyResponse);
      //   }
      //   break;
      // }

      case events.APPTENTIVE_NOTE_CLICK_INTERACTION:
      case events.APPTENTIVE_NOTE_DISMISS: {
        if (eventData) {
          this.console('info', 'Adding Note Action:', eventData.id, eventData);
          LogicEngine.augmentNote(this.interaction_counts, eventData.id, eventData as IStoreNoteResponse);
        }
        break;
      }

      default: {
        this.console('info', 'Unused Event:', event);
        break;
      }
    }
  }

  /**
   * Update the count of seen Interactions for the given Interaction.
   * @param {object} interaction - The Interaction to engage.
   */
  engageInteraction(interaction: IInteraction) {
    this.console('info', 'Engage Interaction:', interaction);
    LogicEngine.createOrUpdate(this.interaction_counts, interaction.id);
  }

  /**
   * Resets the instance back to the initial empty state.
   */
  reset() {
    this.code_point = {};
    this.interaction_counts = {};
    this.random = {};
    this.device = {} as IDevice;
    this.person = {} as IPerson;
  }
}
