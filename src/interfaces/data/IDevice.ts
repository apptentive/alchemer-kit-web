export interface IDevice {
  [key: string]: any;
  browser_height: number;
  browser_width: number;
  cookie_enabled: boolean;
  browser_languages: readonly string[];
  locale_language_code: string;
  locale_raw: string;
  user_agent: string;
  browser_vendor: string;
  screen_width: number;
  screen_height: number;
  orientation_angle: number;
  orientation_type: OrientationType;
  uuid: string;
  custom_data: object;
}

export enum OsNameEnum {
  // TODO: uncomment when os_version for windows will be implemented
  // WINDOWS_10 = 'Windows 10',
  // WINDOWS_8_1 = 'Windows 8.1',
  // WINDOWS_8 = 'Windows 8',
  // WINDOWS_7 = 'Windows 7',
  // WINDOWS_VISTA = 'Windows Vista',
  // WINDOWS_XP = 'Windows XP',
  // WINDOWS_SERVER_2003 = 'Windows Server 2003',
  // WINDOWS_2000 = 'Windows 2000',
  // WINDOWS_CE = 'Windows CE',
  // WINDOWS_98 = 'Windows 98',
  // WINDOWS_ME = 'Windows ME',
  // WINDOWS_95 = 'Windows 95',
  WINDOWS = 'Windows',
  MAC_OS = 'MacOS',
  LINUX = 'Linux',
  ANDROID = 'Android',
  IOS = 'iOS',
}
