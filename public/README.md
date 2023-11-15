# Apptentive WebSDK Customizaiton Example

The Apptentive Web SDK is the best way to engage your web customers. Use it to learn about how your customers use your app, to talk to them at the right time, and in the right way.

## Customization

The Apptentive WebSDK can be customized with simple CSS, but we provide a set of [SASS](https://sass-lang.com/) files to make customization even easier. Apptentive Interactions are broken out by type, and can be customized by changing the files directly, or by changing them or extending them, which we will demonstrate in this example. To get started we will assume you have a working knowledge of a Terminal, Node.js and NPM.

The first step will be navigating to our example folder and installing SASS so we can compile the styles as they are:

```shell
cd example/
npm install -g node-sass
node-sass sass/styles.scss -o .
```

After running the above commands the `styles.css` file should now exists. These are the basic styles that ship with the WebSDK, the difference being these are uncompressed for debugging.

Now we need to create some custom styles, we will make the file `NEW_CUSTOM_STYLES.scss` and add our custom styles inside.

The next step will be adding our overrides and custom styles. To add our styles we simply need to add them to the bottom of the `sass/styles.scss` files:

```scss
@import '_config.scss';

...

@import "survey.scss";
@import "note.scss";
@import "love-dialog.scss";
@import "message-center.scss";
@import "placement.scss";

@import "NEW_CUSTOM_STYLES.scss";
```

Now we need to compile out updated styles with the same command as before and test them:

```sh
node-sass sass/styles.scss -o .
```

Since we are overwriting the styles with out custom styles, we need to have our styles online somewhere so we can link to them on every page in the same place we have our SDK code:

```html
<script async src="https://sdk.apptentive.com/v1/apps/500000000000000000000000/websdk"></script>
<link rel="stylesheet" href="https://YOUR_WEBSITE.com/PATH/TO/styles.css" media="screen" charset="utf-8">
```

We can test these styles in our example by running the code below and navigating our browser to `http://localhost:8181/example/` and test our interactions:

```shell
cd ..
npm install
npm run local-web-server
```

You could go a step further by customizing the interaction inside of `fixtures/sdk.js` with your own interactions, but this is requires even more technical knowledge that is not covered here.
