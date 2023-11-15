# Changelog

## [0.5.0](https://github.com/apptentive/apptentive-javascript/compare/apptentive-web-sdk-v0.4.0...apptentive-web-sdk-v0.5.0) (2023-09-14)


### Features

* PBI-3546 - add os data to device ([2b8df39](https://github.com/apptentive/apptentive-javascript/commit/2b8df3964ff51e73ed86ec71db4addf7d5e3321a))
* PBI-5245 - Create event cancel partially ([1f48a9b](https://github.com/apptentive/apptentive-javascript/commit/1f48a9b1c7e5df4e75b529e75a278f47f97ef3ea))


### Bug Fixes

* cross icon event for survey_paged ([1dc8c2b](https://github.com/apptentive/apptentive-javascript/commit/1dc8c2bf9215e1c25acad55e439d2ce1b48452e0))
* PBI-5211 - make web_sdk events consistant with mobile sdk ([d09575c](https://github.com/apptentive/apptentive-javascript/commit/d09575ca3cb183894eb8a1a2d48c2dfba7e30787))

## [0.4.0](https://github.com/apptentive/apptentive-javascript/compare/apptentive-web-sdk-v0.3.0...apptentive-web-sdk-v0.4.0) (2023-04-18)


### Features

* PBI-3790 - converted additional base sdk methods to be async ([0dcd631](https://github.com/apptentive/apptentive-javascript/commit/0dcd631cf8e2a9cbf58391623dc8f4b9ddd482b2))
* PBI-5046 - update create conversation method to be async ([12d3171](https://github.com/apptentive/apptentive-javascript/commit/12d317197bb9fc16a0a32a56699a32706f5440bc))

## [0.3.0](https://github.com/apptentive/apptentive-javascript/compare/apptentive-web-sdk-v0.2.0...apptentive-web-sdk-v0.3.0) (2023-03-21)


### Features

* PBI-4462 - added ability to enable debug and disable capture through class setters ([345f5b1](https://github.com/apptentive/apptentive-javascript/commit/345f5b1c8901194699c315090d4dd751f8ce1cd2))
* PBI-5007 - added utility method canShowInteraction to check if an event will fire an interaction ([980486b](https://github.com/apptentive/apptentive-javascript/commit/980486bbe5acf3bace089f9af1958a79384414cf))


### Bug Fixes

* PBI-4926 - updated message center to properly enable the submit button once a conversation has been created ([eeb449a](https://github.com/apptentive/apptentive-javascript/commit/eeb449a81acdbdc88118f86d9eeabd693eef9761))

## [0.2.0](https://github.com/apptentive/apptentive-javascript/compare/apptentive-web-sdk-v0.1.0...apptentive-web-sdk-v0.2.0) (2023-02-16)


### Features

* PBI-2245 - added minimize button to message center and surveys ([a71af25](https://github.com/apptentive/apptentive-javascript/commit/a71af2561399fa05a103b23cdddff72fe0418708))
* PBI-3693 - updated invokes data model for paged surveys ([#171](https://github.com/apptentive/apptentive-javascript/issues/171)) ([4c9ed5d](https://github.com/apptentive/apptentive-javascript/commit/4c9ed5d90b63b701d7d250ca3dbfc03a867325b1))
* PBI-3693 - updated survey implementation to work with new interaction data structure ([#164](https://github.com/apptentive/apptentive-javascript/issues/164)) ([375d32d](https://github.com/apptentive/apptentive-javascript/commit/375d32d665c788880ed402d50edab07036b8aee7))
* PBI-3694 - update websdk to support new survey branching data model ([#162](https://github.com/apptentive/apptentive-javascript/issues/162)) ([7c3c48c](https://github.com/apptentive/apptentive-javascript/commit/7c3c48ce0c8767b4ec76dd2c2e922993b1592ae3))
* PBI-3778 - updated ui elements in surveys and added progress bar to branched surveys ([#163](https://github.com/apptentive/apptentive-javascript/issues/163)) ([d936ac1](https://github.com/apptentive/apptentive-javascript/commit/d936ac12e339042adecd1eae8c4de9d364c8839f))
* PBI-3780 - update message center ui based on new designs ([#172](https://github.com/apptentive/apptentive-javascript/issues/172)) ([e143637](https://github.com/apptentive/apptentive-javascript/commit/e1436376d26c3a483ea20e999bb74b2713479343))
* PBI-3789 - updated initialization logic, added manifest caching locally ([#181](https://github.com/apptentive/apptentive-javascript/issues/181)) ([7a11779](https://github.com/apptentive/apptentive-javascript/commit/7a11779f08117437659027024aee6dd9302ef5f8))
* PBI-3792 - add url parsing to trigger a survey on initialization ([acd491a](https://github.com/apptentive/apptentive-javascript/commit/acd491a74baabd1dd87df75b5118b469b3b299f6))
* PBI-4204 - added determinate progress bar when more than 10 questions, added dismiss button on thankyou screen ([#174](https://github.com/apptentive/apptentive-javascript/issues/174)) ([318bb20](https://github.com/apptentive/apptentive-javascript/commit/318bb20b6bd2893e995e81ca8725ff5f4bcc6a0b))
* PBI-4226 - add sentinel values to responses payload ([#178](https://github.com/apptentive/apptentive-javascript/issues/178)) ([966f668](https://github.com/apptentive/apptentive-javascript/commit/966f6686849d15908bf9f4c96ec9b37a3ad03321))
* PBI-4466 - refactored api layer to be more resilliant and include retry logic ([7811a74](https://github.com/apptentive/apptentive-javascript/commit/7811a74a74d2e82c214c8c146a3b2a63da558749))
* PBI-4638 - display the introduction page if there is a disclaimer and no intro text ([5f4b065](https://github.com/apptentive/apptentive-javascript/commit/5f4b0655512fca1b7a0e0fa31f340b9c2f08efe0))


### Bug Fixes

* PBI-2975 - added validation for empty other response ([a2b8904](https://github.com/apptentive/apptentive-javascript/commit/a2b8904aca24eb5def4d22a1c0e7147cbedb02a7))
* PBI-3554 - clear out old oauth header when identify person fails and a new conversation is needed ([#155](https://github.com/apptentive/apptentive-javascript/issues/155)) ([d10bbf9](https://github.com/apptentive/apptentive-javascript/commit/d10bbf95ed97a075a2675f078d37909456e80bf4))
* PBI-3558 - ensure the submit endpoint is properly constructed if the survey is created prior to a conversation ([#159](https://github.com/apptentive/apptentive-javascript/issues/159)) ([bccec08](https://github.com/apptentive/apptentive-javascript/commit/bccec088596350e17dd22fd0d1e27d0424101434))
* PBI-3584 - added ability to restore previously set locale ([#154](https://github.com/apptentive/apptentive-javascript/issues/154)) ([b63f415](https://github.com/apptentive/apptentive-javascript/commit/b63f415d44785a16d268a558726ad78f2234e8b7))
* PBI-3691 - store person in local storage if passed into create conversation ([#161](https://github.com/apptentive/apptentive-javascript/issues/161)) ([4e9d989](https://github.com/apptentive/apptentive-javascript/commit/4e9d9898b0109a97cd49d3d755bf409e10926167))
* PBI-3693 - minor updates to the error state on submitting a branched survey ([#170](https://github.com/apptentive/apptentive-javascript/issues/170)) ([e089587](https://github.com/apptentive/apptentive-javascript/commit/e089587541d7ec7c2f1d67ee57380a1d09620542))
* PBI-3778 - update the selected color for UI elements to be blue instead of red ([#165](https://github.com/apptentive/apptentive-javascript/issues/165)) ([1cad88f](https://github.com/apptentive/apptentive-javascript/commit/1cad88f59c2f0ea887f7717141d949a60277081f))
* PBI-3778 - updated survey styling to match design based on feedback ([#166](https://github.com/apptentive/apptentive-javascript/issues/166)) ([e0ef703](https://github.com/apptentive/apptentive-javascript/commit/e0ef703a7aaea74850b0722fb9d5dd03abf0b1e9))
* PBI-3780 - added updated thankyou screen to legacy surveys ([#175](https://github.com/apptentive/apptentive-javascript/issues/175)) ([4fbd0e6](https://github.com/apptentive/apptentive-javascript/commit/4fbd0e646ba88ac03bb4a833ccb021acb76feb04))
* PBI-3780 - removed name validation on message center, minor fixes to css styling ([#177](https://github.com/apptentive/apptentive-javascript/issues/177)) ([2b0fdcb](https://github.com/apptentive/apptentive-javascript/commit/2b0fdcb6a246a4b0724d3443f40f659598355676))
* PBI-3792 - changed appbar render to use name instead of title in surveys ([e59434e](https://github.com/apptentive/apptentive-javascript/commit/e59434e0ee7c11dff59b4d40e5910f04f08e0834))
* PBI-3792 - update interaction counts when interaction is triggered from query parameter ([95da9ff](https://github.com/apptentive/apptentive-javascript/commit/95da9ff1f64ee4ff4d1d92e78d5fb959809b5ef3))
* PBI-3807 - update all elements to use localizable text if available ([#158](https://github.com/apptentive/apptentive-javascript/issues/158)) ([d0049c7](https://github.com/apptentive/apptentive-javascript/commit/d0049c7bbda1914eaad1d79e49399860da7d4a2c))
* PBI-3807 - updated set locale to get manifest from different endpoint ([#160](https://github.com/apptentive/apptentive-javascript/issues/160)) ([feb4027](https://github.com/apptentive/apptentive-javascript/commit/feb40271c4b0a40a5e789b16c1e3605eed04feed))
* PBI-4074 - fixed logic engine mapping ([#173](https://github.com/apptentive/apptentive-javascript/issues/173)) ([6680fe2](https://github.com/apptentive/apptentive-javascript/commit/6680fe2332162e6cfe1eccfdfa4b97e377abda93))
* PBI-4074 - update code_point counts prior to criteria evaluation to ensure correct counts are used ([#168](https://github.com/apptentive/apptentive-javascript/issues/168)) ([238c681](https://github.com/apptentive/apptentive-javascript/commit/238c6812813d3c3e46e5b069364fa28e2c4cb5fc))
* PBI-4478 - add explicit api_version to responses endpoint in v11 surveys ([#180](https://github.com/apptentive/apptentive-javascript/issues/180)) ([e68cfad](https://github.com/apptentive/apptentive-javascript/commit/e68cfad9a2ac85d7330374be558662dd893d941e))
* PBI-4492 - add css to force visibility of radio buttons and checkboxes ([#182](https://github.com/apptentive/apptentive-javascript/issues/182)) ([6e9b6b1](https://github.com/apptentive/apptentive-javascript/commit/6e9b6b1b76a89b77f6e462eedbaad7b8ea68d9f0))
* PBI-4638 - always update the progress indicator whether or not disclaimer text is configured ([5c4dd7a](https://github.com/apptentive/apptentive-javascript/commit/5c4dd7a26d108f2e9064a81693f0c38ec8a83490))
* PBI-4682 - clear out previous answers when collecting responses if the question was previously invalid ([b5512dd](https://github.com/apptentive/apptentive-javascript/commit/b5512ddb3276f0930e8d84e222e255df76c2b1c8))
