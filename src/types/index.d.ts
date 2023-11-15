import type ApptentiveBase from '../base';

declare global {
  interface Window {
    ApptentiveSDK: ApptentiveBase;
  }
}
