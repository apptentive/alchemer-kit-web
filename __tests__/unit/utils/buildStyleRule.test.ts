import buildStyleRule from '../../../src/utils/buildStyleRule';

describe('buildStyleRule', () => {
  describe('unknown', () => {
    test('properly handles unknown style rule', () => {
      const output = buildStyleRule('unknown_rule', '#ffffff');
      expect(output).toBeUndefined();
    });
  });

  describe('note', () => {
    test('background_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('background_color', '#ffffff')!;
      expect(output[0]).toBe('apptentive-note .apptentive-note-content { background-color: rgba(255,255,255,1); }');
      expect(output[1]).toBe(
        'apptentive-note .apptentive-note-content .apptentive-note-title { background-color: rgba(255,255,255,1); }'
      );
    });

    test('font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('font_color', '#ffffff');
      expect(output).toBe('apptentive-note .apptentive-note-content { color: rgba(255,255,255,1); }');
    });

    test('button_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('button_font_color', '#ffffff');
      expect(output).toBe(
        'apptentive-note .apptentive-note-content .apptentive-note-actions .apptentive-note-action h2.apptentive-note-label { color: rgba(255,255,255,1); }'
      );
    });

    test('overlay_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('overlay_color', '#ffffff');
      expect(output).toBe('apptentive-note .apptentive-note-overlay { background-color: rgba(255,255,255,1); }');
    });

    test('overlay_opacity: should return a valid style rule with the correct format', () => {
      let output = buildStyleRule('overlay_opacity', 1);

      expect(output).toBe('apptentive-note .apptentive-note-overlay { opacity: 1; }');

      output = buildStyleRule('overlay_opacity', 0);

      expect(output).toBe(
        'apptentive-note .apptentive-note-overlay { display: none; pointer-events: none; opacity: 0; }'
      );
    });
  });

  describe('surveys', () => {
    // START LEGACY RULES
    test('header_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('header_color', '#ffffff')!;
      expect(output[0]).toBe('apptentive-survey .apptentive-appbar { background-color: rgba(255,255,255,1); }');
      expect(output[1]).toBe('apptentive-survey .apptentive-survey-footer { background-color: rgba(255,255,255,1); }');
    });

    test('header_icon_datauri: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('header_icon_datauri', 'datauri...');
      expect(output).toBe(
        'apptentive-survey .apptentive-appbar .apptentive-appbar__icon { background-image: url(datauri...); }'
      );
    });
    // END LEGACY RULES

    test('survey_background_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('survey_background_color', '#ffffff')!;
      expect(output[0]).toBe('apptentive-survey { background-color: rgba(255,255,255,1); }');
      expect(output[1]).toBe('apptentive-survey .apptentive-survey-intro { background-color: rgba(255,255,255,1); }');
      expect(output[2]).toBe('apptentive-survey ::-webkit-scrollbar-track { background-color: rgba(255,255,255,1); }');
      expect(output[3]).toBe('apptentive-survey ::-webkit-scrollbar-thumb { border-color: rgba(255,255,255,1); }');
      expect(output[4]).toBe(
        'apptentive-survey form.apptentive-survey-questions .apptentive-survey-question.nps answer-choice-container { background-color: rgba(255,255,255,1); }'
      );
      expect(output[5]).toBe(
        'apptentive-survey form.apptentive-survey-questions .apptentive-survey-question.range answer-choice-container { background-color: rgba(255,255,255,1); }'
      );
    });

    test('survey_close_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('survey_close_font_color', '#ffffff')!;
      expect(output[0]).toBe(
        'apptentive-survey .apptentive-appbar__action::before { background-color: rgba(255,255,255,1); }'
      );
      expect(output[1]).toBe(
        'apptentive-survey .apptentive-appbar__action::after { background-color: rgba(255,255,255,1); }'
      );
    });

    test('survey_header_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('survey_header_color', '#ffffff')!;
      expect(output[0]).toBe('apptentive-survey .apptentive-appbar { background-color: rgba(255,255,255,1); }');
      expect(output[1]).toBe('apptentive-survey .apptentive-survey-footer { background-color: rgba(255,255,255,1); }');
    });

    test('survey_header_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('survey_header_font_color', '#ffffff')!;
      expect(output[0]).toBe('apptentive-survey div.apptentive-appbar { color: rgba(255,255,255,1); }');
      expect(output[1]).toBe('apptentive-survey .apptentive-appbar h1 { color: rgba(255,255,255,1); }');
    });

    test('survey_header_icon_datauri: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('survey_header_icon_datauri', 'datauri...');
      expect(output).toBe(
        'apptentive-survey .apptentive-appbar .apptentive-appbar__icon { background-image: url(datauri...); }'
      );
    });

    test('survey_content_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('survey_content_font_color', '#ffffff')!;
      expect(output[0]).toBe('apptentive-survey { color: rgba(255,255,255,1); }');
      expect(output[1]).toBe('apptentive-survey .apptentive-survey-intro { color: rgba(255,255,255,1); }');
      expect(output[2]).toBe('apptentive-survey .apptentive-survey-questions { color: rgba(255,255,255,1); }');
      expect(output[3]).toBe(
        'apptentive-survey .apptentive-message .apptentive-message__content { color: rgba(255,255,255,1); }'
      );
      expect(output[4]).toBe('apptentive-survey .apptentive-disclaimer__text { color: rgba(255,255,255,1); }');
      expect(output[5]).toBe(
        'apptentive-survey form.apptentive-survey-questions .apptentive-survey-question h2.apptentive-survey-question-value { color: rgba(255,255,255,1); }'
      );
      expect(output[6]).toBe(
        'apptentive-survey form.apptentive-survey-questions .apptentive-survey-question question-instructions { color: rgba(255,255,255,1); }'
      );
    });

    test('survey_submit_button_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('survey_submit_button_color', '#ffffff')!;
      expect(output[0]).toBe(
        'apptentive-survey .apptentive-survey-questions button.submit { background-color: rgba(255,255,255,0.9); }'
      );
      expect(output[1]).toBe(
        'apptentive-survey button.apptentive-survey-questions button.submit:hover:not(:disabled) { background-color: rgba(255,255,255,1); }'
      );
      expect(output[2]).toBe(
        'apptentive-survey button.apptentive-button--primary { background-color: rgba(255,255,255,0.9); }'
      );
      expect(output[3]).toBe(
        'apptentive-survey button.apptentive-button--primary:hover:not(:disabled) { background-color: rgba(255,255,255,1); }'
      );
      expect(output[4]).toBe(
        'apptentive-survey button.apptentive-survey__button { background-color: rgba(255,255,255,0.9); }'
      );
      expect(output[5]).toBe(
        'apptentive-survey button.apptentive-survey__button:hover:not(:disabled) { background-color: rgba(255,255,255,1); }'
      );
      expect(output[6]).toBe(
        `apptentive-survey .apptentive-step-indicator__item--current { border-color: rgba(255,255,255,1); background-color: rgba(255,255,255,1); }`
      );
    });

    test('survey_submit_button_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('survey_submit_button_font_color', '#ffffff')!;
      expect(output[0]).toBe(
        'apptentive-survey .apptentive-survey-questions button.submit { color: rgba(255,255,255,1); }'
      );
      expect(output[1]).toBe('apptentive-survey button.apptentive-button--primary { color: rgba(255,255,255,1); }');
      expect(output[2]).toBe('apptentive-survey button.apptentive-survey__button { color: rgba(255,255,255,1); }');
    });
  });

  describe('message center', () => {
    test('mc_background_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('mc_background_color', '#ffffff');

      expect(output).toBe('apptentive-message-center { background-color: rgba(255,255,255,1); }');
    });

    test('mc_close_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('mc_close_font_color', '#ffffff')!;

      expect(output[0]).toBe(
        'apptentive-message-center .apptentive-appbar__action::before { background-color: rgba(255,255,255,1); }'
      );
      expect(output[1]).toBe(
        'apptentive-message-center .apptentive-appbar__action::after { background-color: rgba(255,255,255,1); }'
      );
    });

    test('mc_header_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('mc_header_color', '#ffffff')!;

      expect(output[0]).toBe('apptentive-message-center .apptentive-appbar { background-color: rgba(255,255,255,1); }');
      expect(output[1]).toBe('apptentive-message-center .apptentive-footer { background-color: rgba(255,255,255,1); }');
    });

    test('mc_header_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('mc_header_font_color', '#ffffff')!;

      expect(output[0]).toBe('apptentive-message-center .apptentive-appbar__title { color: rgba(255,255,255,1); }');
    });

    test('mc_content_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('mc_content_font_color', '#ffffff')!;

      expect(output[0]).toBe('apptentive-message-center .apptentive-intro p { color: rgba(255,255,255,1); }');
      expect(output[1]).toBe(
        'apptentive-message-center .apptentive-message-center-greeting h2 { color: rgba(255,255,255,1); }'
      );
      expect(output[2]).toBe(
        'apptentive-message-center .apptentive-message-center-greeting p { color: rgba(255,255,255,1); }'
      );
      expect(output[3]).toBe(
        'apptentive-message-center .apptentive-message-center-profile h2 { color: rgba(255,255,255,1); }'
      );
    });

    test('mc_submit_button_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('mc_submit_button_color', '#ffffff')!;
      expect(output[0]).toBe(
        'apptentive-message-center button.apptentive-button--primary { background-color: rgba(255,255,255,0.9); }'
      );
      expect(output[1]).toBe(
        'apptentive-message-center button.apptentive-button--primary:hover:not(:disabled) { background-color: rgba(255,255,255,1); }'
      );
    });

    test('mc_submit_button_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('mc_submit_button_font_color', '#ffffff')!;

      expect(output[0]).toBe(
        'apptentive-message-center button.apptentive-button--primary { color: rgba(255,255,255,1); }'
      );
    });
  });

  describe('love dialog', () => {
    test('ld_background_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('ld_background_color', '#ffffff');
      expect(output).toBe('apptentive-love-dialog { background-color: rgba(255,255,255,1); }');
    });

    test('ld_close_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('ld_close_font_color', '#ffffff');
      expect(output).toBe('apptentive-love-dialog .close-love-dialog { color: rgba(255,255,255,1); }');
    });

    test('ld_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('ld_font_color', '#ffffff');
      expect(output).toBe('apptentive-love-dialog .apptentive-love-dialog-title h1 { color: rgba(255,255,255,1); }');
    });

    test('ld_button_font_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('ld_button_font_color', '#ffffff');
      expect(output).toBe(
        'apptentive-love-dialog .apptentive-love-dialog-actions button.apptentive-love-dialog-action { color: rgba(255,255,255,1); }'
      );
    });

    test('ld_button_color: should return a valid style rule with the correct format', () => {
      const output = buildStyleRule('ld_button_color', '#ffffff');
      expect(output).toBe(
        'apptentive-love-dialog .apptentive-love-dialog-actions button.apptentive-love-dialog-action { background-color: rgba(255,255,255,1); }'
      );
    });
  });
});
