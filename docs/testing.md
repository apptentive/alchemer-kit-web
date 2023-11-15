## Testing

Because this is an SDK meant to be consumed in an array of environments and setups, having robust testing is imperative. Every feature added is expected to have tests created to ensure it works as expected and continues to as the codebase grows.

To assist with this goal, this repository also has a GitHub action configured to run tests whenever a PR is opened and requires all tests to be passing before merging.

### Unit Tests

Once changes have been made and are ready to be committed, execute this command to run the tests:

```sh
$ npm run test
```

Once the tests complete, a code coverage listing will output to the console to show total coverage across files. It is expected that every file be at least **90%** coverage with a preference for 95%+.

Additionally, a report will be generated in the `/coverage/lcov-report` directory. To view coverage interactively, open the `index.html` file in the above folder to view each file coverage individually.

### Integration Tests

In addition to unit tests, this library also includes integration tests that executes the library in real browser instances. This leverages Playwright for the browser automation and the tests can be found in the [e2e folder](../__tests__/e2e/) alongside the unit tests.
