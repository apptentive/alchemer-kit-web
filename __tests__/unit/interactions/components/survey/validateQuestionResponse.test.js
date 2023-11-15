import validateQuestionResponse from '../../../../../src/interactions/components/survey/validateQuestionResponse.ts';

describe('validateQuestionResponse', () => {
  describe('singleline', () => {
    test('properly reports error if answer is missing and question is required', () => {
      const isValid = validateQuestionResponse(
        {
          type: 'singleline',
          required: true,
        },
        []
      );

      expect(isValid).toBe(false);
    });

    test('treats only-whitespace answers as empty', () => {
      const isValid = validateQuestionResponse(
        {
          type: 'singleline',
          required: true,
        },
        [
          {
            value: '     \n   ',
          },
        ]
      );

      expect(isValid).toBe(false);
    });
  });

  describe('multiselect', () => {
    test('properly reports error when there are too few answers', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: true,
        min_selections: 2,
        max_selections: 3,
      };
      const answers = [
        {
          value: 'd2e6b3b9-454e-5b96-bec0-e9d5cabef8a2',
          other: 'something else',
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(false);
    });

    test('allows any amount of answers under the max when min_selections is not configured', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: true,
        max_selections: 3,
      };
      const answers = [
        {
          value: 'd2e6b3b9-454e-5b96-bec0-e9d5cabef8a2',
          other: 'something else',
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(true);
    });

    test('properly reports error when there are too many answers', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: true,
        min_selections: 2,
        max_selections: 3,
      };
      const answers = [
        {
          value: 'b2aee3e3-b0be-58d0-b36d-8b0e6274f743',
        },
        {
          value: '64a6a038-5476-52ef-b259-4cda22e6e141',
        },
        {
          value: '9129e67b-5102-5558-8231-55db0727fd96',
        },
        {
          value: 'd2e6b3b9-454e-5b96-bec0-e9d5cabef8a2',
          other: 'something else',
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(false);
    });

    test('allows any number of answers when max_selections is not defined', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: true,
        min_selections: 2,
      };
      const answers = [
        {
          value: 'b2aee3e3-b0be-58d0-b36d-8b0e6274f743',
        },
        {
          value: '64a6a038-5476-52ef-b259-4cda22e6e141',
        },
        {
          value: '9129e67b-5102-5558-8231-55db0727fd96',
        },
        {
          value: 'd2e6b3b9-454e-5b96-bec0-e9d5cabef8a2',
          other: 'something else',
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(true);
    });

    test('properly handles no answers being passed in', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: true,
        min_selections: 1,
      };

      const answers = [
        {
          value: 'b2aee3e3-b0be-58d0-b36d-8b0e6274f743',
        },
        {
          value: 'd2e6b3b9-454e-5b96-bec0-e9d5cabef8a2',
          other: '',
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(false);
    });

    test('properly fails validation when an empty other response is passed', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: true,
        min_selections: 1,
      };

      const isValid = validateQuestionResponse(currentQuestion, undefined);
      expect(isValid).toBe(false);
    });

    test('properly fails validation when an other response containing only spaces is passed', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: true,
        min_selections: 1,
      };

      const answers = [
        {
          value: 'd2e6b3b9-454e-5b96-bec0-e9d5cabef8a2',
          other: '     \t',
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(false);
    });

    test('properly passes validation when question is not required and empty', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: false,
        min_selections: 1,
        max_selections: 3,
      };

      const isValid = validateQuestionResponse(currentQuestion, []);
      expect(isValid).toBe(true);
    });

    test('properly passes validation when question is not required and has too many answers', () => {
      const currentQuestion = {
        type: 'multiselect',
        required: false,
        min_selections: 1,
        max_selections: 3,
      };

      const answers = [
        {
          value: 'decd3021-203b-5be5-8b0e-5950f8a73036',
        },
        {
          value: '33826ac6-2ceb-5fc8-924e-5e82ab168caf',
        },
        {
          value: '6d6c51e4-ecc0-5ac4-9174-283c68531c92',
        },
        {
          value: '6bf76a52-37c6-5eb4-82db-cc7a33fdffd0',
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(false);
    });
  });

  describe('range | nps', () => {
    test('properly reports errors when the value is too low', () => {
      const currentQuestion = {
        type: 'nps',
        required: true,
        min: 1,
        max: 10,
      };
      const answers = [
        {
          value: 0,
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(false);
    });

    test('defaults to a value of 1 when min configuration is not defined', () => {
      const currentQuestion = {
        type: 'nps',
        required: true,
        max: 10,
      };

      const answers = [
        {
          value: 1,
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(true);
    });

    test('properly reports error when the value is too high', () => {
      const currentQuestion = {
        type: 'nps',
        required: true,
        min: 1,
        max: 10,
      };
      const answers = [
        {
          value: 11,
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(false);
    });

    test('defaults to infinity when max configuration is not defined', () => {
      const currentQuestion = {
        type: 'nps',
        required: true,
        min: 1,
      };

      const answers = [
        {
          value: 200560490131,
        },
      ];

      const isValid = validateQuestionResponse(currentQuestion, answers);
      expect(isValid).toBe(true);
    });

    test('properly handles no answers being passed in', () => {
      const currentQuestion = {
        type: 'nps',
        required: true,
        min: 1,
      };

      const isValid = validateQuestionResponse(currentQuestion, undefined);
      expect(isValid).toBe(false);
    });
  });
});
