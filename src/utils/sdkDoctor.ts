import ApptentiveApi from '../api';
import type ApptentiveBase from '../base';
import { IConversation } from '../interfaces/data/IConversation';
import type LogicEngine from '../logic-engine';

export interface IDoctorMetadata {
  currentLanguage: string;
  defaultLanguage: string;
  debug: boolean;
  readOnly: boolean;
  session_id: string;
  version: string;
}

const logObject = (
  logger: ApptentiveBase['console'],
  key: string,
  value: Record<string, string | number | boolean>
) => {
  const valueKeys = Object.keys(value);

  if (valueKeys.length === 0) {
    logger('info', `   - ${key}: [empty]`);
  } else {
    logger('info', `   - ${key} (${valueKeys.length}):`);
    valueKeys.forEach((item) => {
      const itemValue = value[item];

      logger('info', `     - ${item}: ${typeof itemValue === 'object' ? JSON.stringify(itemValue) : itemValue}`);
    });
  }
};

// https://stackoverflow.com/a/15720835
const calculateStorageSize = () => {
  if (window.localStorage.Apptentive) {
    const itemLength = (window.localStorage.Apptentive.length + 'Apptentive'.length) * 2;

    return (itemLength / 1024).toFixed(2);
  }

  return -1;
};

const sdkDoctor = (
  logger: ApptentiveBase['console'],
  logicEngine: LogicEngine,
  ajax: ApptentiveApi,
  conversation: IConversation,
  metadata: IDoctorMetadata
) => {
  logger('info', '❤️‍🩹 Apptentive Doctor ❤️‍🩹');
  logger('info', 'Please copy and paste the full output below to assist troubleshooting any issue that arises.');

  // Output the interactions and counts for those interactions
  const interactionIds = logicEngine.interactions.map((interaction) => interaction.id);
  const interactionCounts = logicEngine.interaction_counts;

  logger('info', ' ');
  logger('info', `🤝 Interactions (${interactionIds.length}):`);

  interactionIds.forEach((interactionId) => {
    const interactionData = interactionCounts[interactionId];
    logger(
      'info',
      `   - ${interactionId}: { invokes: ${interactionData?.invokes?.total ?? 0}, last invoke: ${
        interactionData?.last_invoked_at ? new Date(interactionData.last_invoked_at).toUTCString() : null
      }, last submission: ${
        interactionData?.last_submission_at ? new Date(interactionData.last_submission_at).toUTCString() : null
      } }`
    );
  });

  // Output the available events to be targeted and the invokes on those events
  const targetedEvents = Object.keys(logicEngine.targeted_events);
  const codePoints = logicEngine.code_point;

  logger('info', ' ');
  logger('info', `🎯 Event Targets (${targetedEvents.length}):`);

  targetedEvents.forEach((targetedEvent) => {
    const eventData = codePoints[targetedEvent];
    const eventInteractions = logicEngine.targeted_events[targetedEvent].map((event) => event.interaction_id);

    logger(
      'info',
      `   - ${targetedEvent}: { invokes: ${eventData?.invokes?.total ?? 0}, last invoke: ${
        eventData?.last_invoked_at ? new Date(eventData.last_invoked_at).toUTCString() : null
      }, interactions: ${eventInteractions.join(', ')} }`
    );
  });

  // Output Conversation
  logger('info', ' ');
  logger('info', '💬 Conversation:');
  if (conversation) {
    logger('info', `   - id: ${conversation.id}`);
    logger('info', `   - device_id: ${conversation.device_id}`);
    logger('info', `   - person_id: ${conversation.person_id}`);
    logger('info', `   - state: ${conversation.state}`);
    logger('info', `   - token: ${conversation.token ? '[exists]' : '[empty]'}`);
  } else {
    logger('warn', '❌ A conversation must be created before events can be emitted or interactions triggered.');
  }

  // Output Person
  logger('info', ' ');
  logger('info', '🧑 Person:');

  if (logicEngine.person) {
    const { name, email, custom_data: customData } = logicEngine.person;
    const customDataKeys = Object.keys(customData ?? {});

    logger('info', `   - name: ${name}`);
    logger('info', `   - email: ${email}`);

    if (customDataKeys.length > 0) {
      logObject(logger, 'custom_data', customData!);
    }
  } else {
    logger('info', 'No person has been identified');
  }

  // Output Device Metadata
  logger('info', ' ');
  logger('info', '💻 Device:');
  Object.keys(logicEngine.device)
    .sort()
    .forEach((key) => {
      const value = logicEngine.device[key];

      if (typeof value === 'object') {
        logObject(logger, key, value);
      } else {
        logger('info', `   - ${key}: ${logicEngine.device[key]}`);
      }
    });

  // Output API Information
  logger('info', ' ');
  logger('info', '📮 API:');
  logger('info', `   - Queue Length: ${ajax.queue.length}`);

  // Output Various Other Values
  logger('info', ' ');
  logger('info', '🛠 Settings:');
  logger('info', `   - Current Language: ${metadata.currentLanguage}`);
  logger('info', `   - Default Language: ${metadata.defaultLanguage}`);
  logger('info', `   - Debug: ${metadata.debug}`);
  logger('info', `   - Readonly: ${metadata.readOnly}`);
  logger('info', `   - Session ID: ${metadata.session_id}`);
  logger('info', `   - Storage Size: ${calculateStorageSize()} KB`);
  logger('info', `   - Version: ${metadata.version}`);
};

export default sdkDoctor;
