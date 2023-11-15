(function initApptentiveSDK() {
  // DO NOT EDIT
  // This will be replaced dynamically in the server.js response function
  const manifest = {};
  (window.ApptentiveSDK = window.ApptentiveSDK || []).config = {
    id: 'REPLACEME',
    token: 'FAKE_API_TOKEN',
    authentication_key: 'IOS-MOBILE-WEB-AUTH-KEY',
    authentication_signature: 'test-websdk-auth-signature',
    settings: {
      hide_branding: false,
      message_center: {
        title: 'Message Center',
        fg_poll: 10,
        bg_poll: 300,
        email_required: false,
        notification_popup: { enabled: false },
      },
      support_image_url: 'https://app-icons.apptentive.com/5c5b68508cf56b3ca90000f0_1563833415.png',
      message_center_enabled: true,
      metrics_enabled: true,
      apptimize_integration: false,
      collect_ad_id: false,
      'cache-expiration': '2020-07-27T17:53:15+00:00',
      styles: {
        background_color: '#dc2636',
        button_font_color: '#ffffff',
        font_color: '#ffffff',
        // header_color: '#663399',
        ld_background_color: '#dc2636',
        ld_border_color: '#663399',
        ld_button_color: '#ffffff',
        ld_button_font_color: '#dc2636',
        ld_close_font_color: '#ffffff',
        ld_font_color: '#ffffff',
        mc_border_color: '#ffffff',
        mc_header_color: '#663399',
        mc_close_font_color: '#ffffff',
        mc_submit_button_color: '#663399',
        overlay_color: '#000000',
        overlay_opacity: 0,
        survey_background_color: '#b7e4c7',
        survey_border_color: '#46add6',
        survey_close_font_color: '#b7e4c7',
        survey_content_font_color: '#081c15',
        survey_header_color: '#1b4332',
        survey_header_font_color: '#b7e4c7',
        survey_header_icon_datauri: '',
        survey_submit_button_color: '#2d6a4f',
        survey_submit_button_font_color: '#caf0f8',
      },
    },
    interactions: manifest.interactions,
    targeted_events: manifest.targets,
    debug: true,
    skipStyles: true, // Do not load CDN styles.
    force_refresh: false,
    host: '/api',
    customStyles: false,
  };

  const sdkScript = document.createElement('script');
  // relative path for local dev
  sdkScript.src = '/lib/sdk.js';

  const p = document.querySelectorAll('script')[0];
  p.parentNode.insertBefore(sdkScript, p);
})();
