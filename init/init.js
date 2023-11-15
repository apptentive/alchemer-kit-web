(function initApptentiveSDK() {
  // eslint-disable-next-line no-multi-assign
  const ApptentiveSDK = window.ApptentiveSDK = window.ApptentiveSDK || [];
    
  if (!ApptentiveSDK.version || !ApptentiveSDK.loaded) {
    ApptentiveSDK.loaded = true;
    ApptentiveSDK.methods = [
      'buildDevice',
      'createConversation',
      'createMessage',
      'engage',
      'identifyPerson',
      'setOption',
      'setPageName',
      'showInteraction',
      'showMessageCenter',
      'updatePerson',
    ];
    ApptentiveSDK.factory = function factory(t) {
      return function f(...args) {
        const e = Array.prototype.slice.call(args);
        e.unshift(t);
        ApptentiveSDK.push(e);
        return ApptentiveSDK;
      };
    };
    for (let i = 0; i < ApptentiveSDK.methods.length; i++) {
      const method = ApptentiveSDK.methods[i];
      ApptentiveSDK[method] = ApptentiveSDK.factory(method);
    }
    ApptentiveSDK.LOADER_VERSION = '1.0.0';
  }
}());
