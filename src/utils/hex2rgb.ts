/**
 * Convert HEX colors to RGBA.
 *
 * @static
 * @param {string} hex - The 3 or 6 digit hex color, with or without '#'.
 * @param {number} [opacity=1] - The opacity value, a value between 0 and 1.
 * @returns {string} - The converted hex value to an rgba() value string.
 */
const hex2rgb = (hex: string, opacity = 1) => {
  const hexFormatted = String(hex).replace('#', '').slice(0, 6);
  // eslint-disable-next-line security/detect-non-literal-regexp
  const hexMatches = hexFormatted.match(new RegExp(`(.{${hexFormatted.length / 3}})`, 'g'));

  if (!hexMatches || hexMatches.length < 2) {
    return 'inherit';
  }

  const hexArray = [];

  for (let i = 0; i < hexMatches.length; i++) {
    const hexInt = Number.parseInt(hexMatches[i].length === 1 ? hexMatches[i] + hexMatches[i] : hexMatches[i], 16);
    hexArray.push(hexInt);
  }

  // If opacity is any value other than a number, default to 1
  hexArray.push(typeof opacity === 'number' ? opacity : 1);

  return `rgba(${hexArray.join(',')})`;
};

export default hex2rgb;
