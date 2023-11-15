export enum StoreType {
  appStore,
  playStore,
}

const buildStoreUrl = (method: StoreType, storeId: string, userAgent: string) => {
  if (method === StoreType.appStore) {
    // NOTE: Check iOS: https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    const iOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    return iOS
      ? `itms-apps://itunes.apple.com/app/id${storeId}?action=write-review`
      : `https://itunes.apple.com/app/id${storeId}?mt=8`;
  }

  if (method === StoreType.playStore) {
    return `https://play.google.com/store/apps/details?id=${storeId}`;
  }

  return '';
};

export default buildStoreUrl;
