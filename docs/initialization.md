# SDK Initialization

The Web SDK is very similar to other JavaScript based third-party integrations that you might have experience with in the past. Ultimately when being integrated on a site, there is a script snippet to include which loads up the SDK, a set of options that get parsed and passed into the base class constructor, and a series of companion class creations that handle everything from the API to translations.

To better understand how this works, let's start with how the SDK gets included on a given page.

## SDK Install

After a web application has been created in the dashboard, a script snippet will be generated to be included on every page. That snippet looks something like this:

```js
<script>
(function initApptentiveSDK() {
    var ApptentiveSDK = window.ApptentiveSDK = window.ApptentiveSDK || [];
    if (!ApptentiveSDK.version) {
        if (!ApptentiveSDK.loaded) {
            ApptentiveSDK.loaded = true;
            ApptentiveSDK.methods = ["buildDevice", "createConversation", "createMessage", "engage", "getSegments", "identifyPerson", "setOption", "setPageName", "showInteraction", "showMessageCenter", "updatePerson"];
            ApptentiveSDK.factory = function factory(t) {
                return function f() {
                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key]
                    }
                    var e = Array.prototype.slice.call(args);
                    e.unshift(t);
                    ApptentiveSDK.push(e);
                    return ApptentiveSDK
                }
            };
            for (var i = 0; i < ApptentiveSDK.methods.length; i++) {
                var method = ApptentiveSDK.methods[i];
                ApptentiveSDK[method] = ApptentiveSDK.factory(method)
            }
            ApptentiveSDK.LOADER_VERSION = "1.0.0"
        }
    }
})();
</script>
<script async src="https://sdk.apptentive.com/v1/apps/<APP_ID>/websdk"></script>
```

Let's go through both of these scripts to understand what each of them are responsible for.

### Scaffolding

Since the SDK is intended to be loaded asynchronously, there is no guarantee that the SDK methods will be available at the time the document is ready. In order to combat this, the first script scaffolds the various methods available from the base class and introduces a queue that stores those calls until the SDK is fully ready and loaded on the page.

This allows a customer integrating with it to not have to worry about when to call `createConversation` or `engage` from their code and have confidence that whenever those calls are made, the SDK will handle them when it is ready. Here is a flow of what that looks like from a page example:

- Page begins loading
- WebSDK scaffold script loads
- WebSDK library script begins async loading
- Customer script loads and begins executing
  - Customer script calls `createConversation`
  - WebSDK scaffold script receives the call and adds it to a queue
- WebSDK library script finishes loading
  - During initialization it reads in the queue and calls the methods that were called prior.

While a very simple script, this snippet is crucial to ensuring a delightful SDK experience when integrating with the WebSDK.

### Configuration

The second script is what is responsible for loading the options associated with the WebSDK and adding the main library script to the page. Unlike other third-party libraries, the source is actually an API request to the `/websdk` endpoint that returns a dynamically generated JavaScript file. Here is an example response from that endpoint:

```js
(function initApptentiveSDK() {
  var manifest = ({
    interactions: [
      // ...
    ],
    targeted_events: [
      // ...
    ],
  }((window.ApptentiveSDK = window.ApptentiveSDK || [])).config = {
    id: '<APP_ID>',
    token: '<API_TOKEN>',
    settings: {
      // ...
    },
    interactions: manifest.interactions,
    targeted_events: manifest.targets,
    debug: false,
    force_refresh: false,
    host: 'https://api.apptentive.com',
  });
  var s = document.createElement('script');
  s.async = true;
  s.src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'sdk.apptentive.com/v1/sdk.min.js';
  var p = document.getElementsByTagName('script')[0];
  p.parentNode.insertBefore(s, p);
})();
```

Effecively this script adds the configuration to the window object that the SDK needs to initialize and adds the actual library script to the page. When the library script loads, it will read in that config during intitialization and set itself to be the `window.ApptentiveSDK` object.

## Main Library

Now that we've walked through how the SDK is loaded on the page and how the initial configuration is added, let's go through what happens during the main library initialization.

### Constructor

The main library is a single base class that creates a number of companion classes (e.g., API, Logic Engine, Translations) as well as hydrates itself from data stored in `localStorage` and prepares itself to handle events and interactions. Here is a high level overview of the operations it does on creation:

- Checks that localStorage is available
  - If that check fails, the SDK will halt initialization
- Merges the options from the config with the default options and any options stored in `localStorage`
  - Order of merging is defaultOptions => configOptions => localStorageOptions
- Checks that there is a valid API Token
  - If no token is available the SDK will halt initialization
- Appends CSS styles to the page based on the configuration options from the dashboard
- Initializes the localStorage database wrapper (accessible via `ApptentiveSDK.db`)
- Sets the debug and captureDisabled properties
- Restores a previously stored conversation
- Initializes the API layer with various options (accessible via `ApptentiveSDK.api`)
- Initializes the logic engine to process events and interactions
- Initializes the translation layer for the default language
- Fetches or restores a manifest to ensure the most up to date configuration
- Flushes the queue from the scaffolding script
- Sets itself to the `window.ApptentiveSDK` object

### Options

One important thing to note is how to modify options to feed into the constructor. Like mentioned above, options are merged from the default options object and the configuration from the dashboard, but also allows localStorage options to override anything for testing purposes.

Here is a list of all the options available to override:

#### `apiVersion`

_default: 12_

The version of the API to communicate with. This will be appended to all API requests as a query string parameter (e.g., `${host}/${path}?api_version=${apiVersion}`)

#### `captureDisabled`

_default: false_

Sets whether or not the SDK should capture event data for the current conversation. This is used primarily to respect a user's choice to opt-out of tracking or comply with privacy regulations.

#### `customStyles`

_default: false_

Sets whether or not the SDK should append _any_ CSS styles to the page. Use this option if there are custom styles that 100% control the rendering of all interaction elements.

#### `debug`

_default: false_

Sets the SDK to debug mode with verbose logging of all interactions and requests.

#### `domNode`

_default: 'body'_

A CSS selector string that is used to locate the element on the page to inject interaction containers into. This can be used if a specific element is desired for all interactions to be rendered within (such as needing to modify the z-index to appear above all other elements).

#### `force_refresh`

_default: false_

Prevents the SDK from restoring the previous conversation and instead forces the creation of a new one.

#### `id`

_default: null_

Override the app id from the configuration object. This should only be used when attempting to masquerade as a different app and should almost exclusively be used in combination with the `readOnly` setting to ensure that no inaccurate data is sent under that app.

#### `host`

_default: 'https://api.apptentive.com'_

Override the API host for all requests. This can be used to test new endpoints or coordinate testing in lower environments.

#### `readOnly`

_default: false_

Sets the SDK into readonly mode, which will return a mock success for all API requests. This allows for testing a production app without the risk of sending bad data to the server under a real app id.

#### `settings`

_default: null_

Allows overriding the settings object that comes from the configuration. Here is a full output of that object to see what is available to override:

```js
{
  "hide_branding": false,
  "message_center": {
    "title": "Message Center",
    "fg_poll": 10,
    "bg_poll": 300,
    "email_required": false,
    "notification_popup": {
      "enabled": false
    }
  },
  "support_image_url": "<URL>",
  "message_center_enabled": true,
  "metrics_enabled": true,
  "apptimize_integration": false,
  "collect_ad_id": false,
  "cache-expiration": "<TIMESTAMP>",
  "styles": {
    "ld_background_color": "#FFFFFF",
    "ld_border_color": "#C1CFD1",
    "ld_close_font_color": "#0079BC",
    "ld_font_color": "#00233C",
    "ld_button_font_color": "#FFFFFF",
    "ld_button_color": "#0079BC",
    "mc_header_color": "#5E1977",
    "mc_header_font_color": "#FFFFFF",
    "mc_close_font_color": "#FFFFFF",
    "mc_content_font_color": "#00233C",
    "mc_background_color": "#FFFFFF",
    "mc_border_color": "#C1CFD1",
    "mc_submit_button_color": "#0079BC",
    "mc_submit_button_font_color": "#FFFFFF",
    "header_color": "#5E1977"
  }
}
```

#### `skipStyles`

_default: false_

Configures the SDK to not append the base stylesheet with all of the primary CSS styling. Enabling this option will still add the custom styles based on the configuration from the settings object, but will not add the main CSS file.

#### `token`

_default: null_

Override the API token from the configuration object. This should almost exclusively be done in combination with overriding the app id in order to properly authenticate with the server.

### Option Overrides

Here is an example of how to set any of the above overrides from the browser console:

```js
// Overrides are stored in the ApptentiveSDKOptions key
const overrides = {
  captureDisabled: true,
  debug: true,
  domNode: '#renderingElement',
  force_refresh: true,
  readOnly: true,
  skipStyles: true,
};

window.localStorage.setItem('ApptentiveSDKOptions', JSON.stringify(overrides));
```

Once that has been set, reload the page and the options will be read in on the next page load and will persist until cleared from localStorage.
