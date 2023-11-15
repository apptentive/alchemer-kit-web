const isLocalStorageAvailable = (): boolean => {
  const uid = `${Date.now()}`;

  try {
    window.localStorage.setItem(uid, uid);
    window.localStorage.removeItem(uid);

    return true;
  } catch (ignore) {
    return false;
  }
};

export default isLocalStorageAvailable;
