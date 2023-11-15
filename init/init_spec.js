describe('Initialization', () => {
  describe('Setup', () => {
    test('should set the loaded flag', (t) => {
      t.true(ApptentiveSDK.loaded);
    });
  });

  describe('Stubbing', () => {
    test('should stub method calls for all public methods', (t) => {
      ApptentiveSDK.createConversation({});
      ApptentiveSDK.engage('test-123');
      ApptentiveSDK.createMessage({ body: 'Hello!' });
      t.is(ApptentiveSDK.length, 3);

      t.is(ApptentiveSDK[0][0], 'createConversation');
      t.deepEqual(ApptentiveSDK[0][1], {});

      t.is(ApptentiveSDK[1][0], 'engage');
      t.is(ApptentiveSDK[1][1], 'test-123');

      t.is(ApptentiveSDK[2][0], 'createMessage');
      t.deepEqual(ApptentiveSDK[2][1], { body: 'Hello!' });
    });
  });

  describe('Version', () => {
    test('should set a version', (t) => {
      ApptentiveSDK.LOADER_VERSION.should.not.be.null();
      ApptentiveSDK.LOADER_VERSION.should.equal('1.0.0');
    });
  });
});
