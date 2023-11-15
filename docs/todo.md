# TODO Listing

These are TODOs for the repository that are future ideas to improve the overall structure and / or functionality of the codebase.

- [ ] Move all class names to the [selector enum](/src/constants/elementSelectors.ts).
  - In various interaction files there are a number of class names that get added or used in `querySelector` methods. The intention of this improvement is to move all of those strings into a string enum to be able to reference in both tests as well as the actual interaction render methods themselves to provide an abstraction and typechecking on the selectors.
- [ ] Incorporate examples to the JSDoc comments on methods to provide better intellisense.
  - The JSDoc comments currently only list the parameters and return values. This would add examples to those comments to better document the actual usage of those methods. The highest value areas to add this in would be the base class methods followed by the utility methods.
- [ ] Convert all test files to typescript
  - The vast majority of test files have been converted already, but the few stragglers should be migrated to TypeScript to finish it off.
  - Additionally, there will most likely be a need to create [data generators](/__tests__/mocks/generators/) for those files (e.g., survey configuration) in order to get the proper typings into test files.
- [ ] Create Vue and React integration tests to validate the bindings are working as expected
  - Currently in all of the class implementation the public methods all get bound to the `this` scope. This is something leftover from the legacy implementation and is a part of the code that should be tested via integration tests. Ideally there is a testing environment created for a react app and a vue app that leverages the websdk to test whether or not the bindings are necessary.
  - This will also provide better confidence that the sdk is working as expected when also using a JavaScript framework on the page and interacting with the sdk from within a component.
- [ ] Separate tests that are pure integration tests vs unit tests
  - There are many unit tests around interactions that are really integration tests (e.g., message center thank you screen). These ideally would be moved to be integration tests that could be run in a true browser environment instead of validated in a JSDOM environment.
- [ ] Output typings file
  - When the build:all command is run for the main library JS file, a typings file should also be outputted so that it can be delivered separately from the library.
