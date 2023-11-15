/* eslint-disable no-console */
/**
 * A CustomEvent emitter.
 *
 * @param {string} label - The event label / name to fire.
 * @param {object} [detail] - The event meta data.
 */
export default function browserEvent(label: string, detail?: any) {
  if (!label) {
    return;
  }

  // NOTE: React Native does not have a document.
  if (typeof document === 'undefined') {
    if (console && console.error) {
      console.error('document is not defined');
    }
    return;
  }

  // NOTE: Some environments do not have CustomEvent defined.
  if (typeof CustomEvent !== 'function') {
    if (console && console.error) {
      console.error('CustomEvent is not a function:', typeof CustomEvent);
    }
    return;
  }

  try {
    const event = new CustomEvent(label, { detail });
    document.dispatchEvent(event);
  } catch (error) {
    if (console && console.error) {
      console.error('ApptentiveSDK failed to fire event:', label, detail, error);
    }
  }
}
