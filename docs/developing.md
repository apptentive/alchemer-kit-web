# Developing

We've tried to build the WebSDK to be easy to get up and running and start hacking on! It leverages industry standard tooling with minimal dependencies to make installation a breeze and provide a great developer experience.

### Built-with

- [Rollup](https://rollupjs.org/guide/en/) - Module bundler for JavaScript
- [Babel](https://babeljs.io/) - Next generation JavaScript compiler
- [TypeScript](https://www.typescriptlang.org/) - Static JavaScript typing
- [Jest](https://jestjs.io/) - Delightful JavaScript testing framework
- [Playwright](https://playwright.dev/) - Reliable end-to-end testing for modern web apps
- [MSW](https://mswjs.io/) - API mocking using service workers
- [Prettier](https://prettier.io/) - Opinionated code formatter
- [SCSS](https://sass-lang.com/) - Syntactically awesome stylesheets
- [PostCSS](https://postcss.org/) - CSS post processing

## Getting Started

To get started contributing to the WebSDK, please follow the setup instructions below to get the project installed and running locally.

### Pre-requistites

Before continuing with the setup, make sure the following libraries are installed:

- [Node.js v16 or above](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)

If using VSCode, these are recommended extensions to have installed to provide a more delightful experience.

- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Jest Extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)

### Install

After cloning the repository, `cd` into the `alchemer-kit-web` directory and install the npm packages:

```sh
$ npm install
```

_Note: The first time the install is run `husky` will be downloaded and installed which is the framework we use to execute pre-commit hooks_

## Build

To build the library resources (JS and CSS), there are a number of commands that can be used. All `build` tasks are prefixed with `build:` to distinguish them from the other tasks. Here is a list of all the scripts available:

```sh
build:all # Builds all JS and CSS assets
build:styles # Builds testing and main CSS assets
build:styles:debug # Builds unminified testing and main CSS assets for debug purposes
build:styles:lib # Builds main CSS assets only
build:styles:public # Builds testing CSS assets only
build:scripts # Builds main JS assets
```

The simplest way to build is to use the `build:all` task which will output every asset needed for the library to function:

```sh
$ npm run build:all # outputs to /lib folder
```

## Lint

A consistent codebase is a healthy codebase. To make sure that all files follow the same conventions, this repository leverages `eslint` and `prettier` to auto-format code.

### Format on Save (Recommended)

If using VSCode, format on save can be configured to automatically format all files when they are saved locally. To enable this, add these configurations to the settings.json file:

```json
{
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.formatOnSave": true
}
```

This will configure the `prettier` VSCode extension to be a default formatter for the correct source files and enable format on save functionality.

### Manual formatting

To format all files manually, there are linting commands also configured.

```sh
$ npm run format # Lints and fixes any errors with eslint and prettier
```

### Pre-commit Hooks

To support a consistent codebase, there are pre-commit hooks configured as well that run before committing. This leverages [husky](https://www.npmjs.com/package/husky) and runs the `format` task mentioned above.

_Note: Husky will be automatically installed when `npm install` is executed._

## Running UI Locally

To support verifying functionality prior to deploying, a mock ecosystem can be run locally through a node dev server.

### Certificate Installation

While the dev server will serve both `http` and `https` protocols, the testing site is setup by default to expect an `https` url. This is because chrome browsers will not pass the `authorization` header in an AJAX request if not leveraging a secure connection.

In order to configure a secure connection for local testing, a cert and key will need to be generated locally. To get started, first install `mkcert` which is a certificate manager that will add a trusted root authority to your browser to allow the requests to be trusted.

```js
$ brew install mkcert

// If using firefox, also run this command
$ brew install nss

// Then run this command to create a local CA
$ mkcert -install

// Create and navigate to a certs directory inside the server folder
$ mkdir ./server/certs
$ cd ./server/certs

// Create a trusted cert for localhost in the current directory
$ mkcert localhost 127.0.0.1 ::1

// Finally, add the additional CA for use in node programs
$ export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

Once that is complete, run the dev server command below and navigate to the https URL from the logs and validate that the padlock in the browser shows a secure connection.

_Note: If you are running FireFox, make sure to restart the browser before running the dev command to ensure the new CA is loaded up properly._

### Dev Server

```shell
$ npm run start
```

If you have configured `https` from the previous section, visit <https://localhost:3002> in a browser to get started testing.

If you are wanting to use `http` only, open the [index.html](../public/standard/index.html) file and update the script reference near the bottom to use the `http` protocol and then navigate to <http://localhost:3001> for testing.

```html
<!-- Change this line -->
<script src="https://localhost:3002/fixtures/v1/apps/tester/websdk"></script>

<!-- To this -->
<script src="http://localhost:3001/fixtures/v1/apps/tester/websdk"></script>
```

### Request / Response Logging

As you test, you can observe the request chain by watching network and source logs in the browser or the terminal where the command above is running. The API is mocked using [json-server](https://www.npmjs.com/package/json-server) and tries to emulate the server responses as closely as possible.

_To view additional endpoint configurations, see the `server.js` file at the repository root._

### Customize Interactions

To add or modify interactions that are in the manifest returned to the websdk, update the file at `/server/mocks/manifest-<language>.json` file.

### Customize SDK Options

To add or modify options that are returned to the SDK from the `/websdk` endpoint, modify the file at `/server/sdk.js` which will automatically be returned on the next page load.

### Updating Source Code

If changes are needed to the source code while testing locally, make sure to rebuild the source files (using `npm run build:all`) and then reload the page once that command finishes.

## Commit Messages

To support the CI/CD pipeline in place, it's important that commit messages follow a strict pattern so that the release utility can parse the messages, generate the changelog, and properly increment the library version. For this, we follow the standard-commit convention for all messages. Below is a list of all supported types and message examples:

- `feat` - Features
- `feature` - Features
- `fix` - Bug Fixes
- `perf` - Performance Improvements
- `revert` - Reverts
- `docs` - Documentation
- `style` - Styles
- `chore` - Miscellaneous Chores
- `refactor` - Code Refactoring
- `test` - Tests
- `build` - Build System
- `ci` - Continuous Integration

```sh
# The message convention is:
# <type>: <ticket_number> - <message>
$ git commit -m "feat: PBI-1212 - added feature to library"
$ git commit -m "fix: PBI-2323 - fixed issue preventing feature from working"
$ git commit -m "test: PBI-3434 - added unit tests around certain feature"
$ git commit -m "ci: PBI-4545 - update github actions to increase coverage requirement"
```

_Note: see [deployment docs](/docs/deployment.md) from more information._
