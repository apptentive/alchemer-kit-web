const s4 = function s4(): string {
  return Math.trunc((1 + Math.random()) * 0x10000)
    .toString(16)
    .slice(1);
};

/**
 * A GUID generator.
 *
 * @returns {string} A GUID string
 */
export default function gguid(): string {
  return `${s4()}${s4()}-${s4()}-4${s4().slice(0, 3)}-${s4()}-${s4()}${s4()}${s4()}`.toLowerCase();
}
