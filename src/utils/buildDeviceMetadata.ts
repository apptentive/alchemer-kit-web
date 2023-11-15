import gguid from '../guid';
import { IDevice, OsNameEnum } from '../interfaces/data/IDevice';

const osNameRules = {
  // TODO: uncomment when os_version for windows will be implemented
  // [OsNameEnum.WINDOWS_10]: ['Windows NT 10.0'],
  // [OsNameEnum.WINDOWS_8_1]: ['Windows NT 6.3', 'Windows 8.1'],
  // [OsNameEnum.WINDOWS_8]: ['Windows NT 6.2', 'Windows 8'],
  // [OsNameEnum.WINDOWS_7]: ['Windows NT 6.1', 'Windows 7'],
  // [OsNameEnum.WINDOWS_VISTA]: ['Windows NT 6.0'],
  // [OsNameEnum.WINDOWS_SERVER_2003]: ['Windows NT 5.2'],
  // [OsNameEnum.WINDOWS_XP]: ['Windows NT 5.1', 'Windows XP'],
  // [OsNameEnum.WINDOWS_2000]: ['Windows NT 5.0', 'Windows 2000'],
  // [OsNameEnum.WINDOWS_CE]: ['Windows CE'],
  // [OsNameEnum.WINDOWS_98]: ['Windows 98', 'Win98'],
  // [OsNameEnum.WINDOWS_ME]: ['Windows ME', 'Win 9x 4.90'],
  // [OsNameEnum.WINDOWS_95]: ['Windows 95', 'Win95', 'Windows_95'],
  [OsNameEnum.WINDOWS]: ['Win'],
  [OsNameEnum.MAC_OS]: ['Mac'],
  [OsNameEnum.LINUX]: ['Linux', 'X11'],
  [OsNameEnum.ANDROID]: ['Android'],
  [OsNameEnum.IOS]: ['iPhone', 'iPad', 'iPod'],
};

const getDeviceOsName = (userAgent: string) => {
  let res = '';
  Object.entries(osNameRules).forEach(([key, valuesArr]) => {
    valuesArr.forEach((value) => {
      if (userAgent.indexOf(value) !== -1) {
        res = key;
      }
    });
  });
  return res;
};

/**
 * Build the current device from the given enviroment.
 * @param {object} [overwrite] - Overwrite specific details derived fron the enviroment with your own values.
 * @returns {object} - The newly created Device object.
 * @static
 */
const buildDeviceMetadata = (overwrite: Partial<IDevice> = {}) => {
  const uuid = gguid();
  const device = {
    uuid,
    custom_data: {},
  } as IDevice;

  // Determine Browser Height
  let browserHeight = 0;

  if (typeof window !== 'undefined' && window.innerHeight) {
    browserHeight = window.innerHeight;
  } else if (document && document.documentElement && document.documentElement.clientHeight) {
    browserHeight = document.documentElement.clientHeight;
  } else if (document && document.body) {
    browserHeight = document.body.clientHeight;
  }

  device.browser_height = browserHeight;

  // Determine Browser Width
  let browserWidth = 0;

  if (typeof window !== 'undefined' && window.innerWidth) {
    browserWidth = window.innerWidth;
  } else if (document && document.documentElement && document.documentElement.clientWidth) {
    browserWidth = document.documentElement.clientWidth;
  } else if (document && document.body) {
    browserWidth = document.body.clientWidth;
  }

  device.browser_width = browserWidth;

  // If a navigator object is set, use it.
  if (typeof window !== 'undefined' && window.navigator) {
    const { cookieEnabled, languages, language, userAgent, vendor } = window.navigator as any;
    device.cookie_enabled = cookieEnabled || false;
    device.browser_languages = languages;

    if (language) {
      [device.locale_language_code] = language.split('-');
      device.locale_raw = language;
    }
    device.user_agent = userAgent;
    device.browser_vendor = vendor;
    device.os_name = getDeviceOsName(userAgent);

    // TODO: unable when device location will be needed
    // navigator.geolocation.getCurrentPosition(
    //   (pos: any) => {
    //     device.position = {
    //       latitude: pos.coords.latitude,
    //       longitude: pos.coords.longitude,
    //       accuracy: pos.coords.accuracy,
    //     };
    //   },
    //   (err: any) => {
    //     console.warn(`ERROR(${err.code}): ${err.message}`);
    //   },
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 5000,
    //     maximumAge: 0,
    //   }
    // );
  }

  // If a screen object is set, use it.
  if (typeof window !== 'undefined' && window.screen) {
    device.screen_width = window.screen.width;
    device.screen_height = window.screen.height;

    if (window.screen.orientation) {
      device.orientation_angle = window.screen.orientation.angle;
      device.orientation_type = window.screen.orientation.type;
    }
  }

  Object.assign(device, overwrite);

  return device;
};

export default buildDeviceMetadata;
