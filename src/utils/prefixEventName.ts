/**
 * @param {string} value - The event label to encode.
 * @returns {string} The clean Event label
 */
const encodeEvent = (value: string) =>
  value
    .replace(/%25/g, '%')
    .replace(/%23/g, '#')
    .replace(/%2F/g, '/')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/\//g, '%2F')
    .trim();

/**
 * @param {string} eventName - The event label to prefix.
 * @returns {string} The prefixed event label.
 */
const prefixEventName = (eventName: string) => {
  if (eventName.startsWith('com.apptentive#') || eventName.startsWith('local#app#')) {
    return eventName;
  }

  return `local#app#${encodeEvent(eventName)}`;
};

export default prefixEventName;
