# Deployment

Deployments for the WebSDK are fully automated through a CI/CD pipeline leveraging GitHub actions. The full output of the WebSDK (JS and CSS assets) live in an S3 bucket that has a CloudFront CDN in front of it to cache the resources.

_Note: See the [staging](../.github/workflows/staging.yml) or [production](../.github/workflows/production.yml) workflows for detailed deployment steps._

## Staging

For staging deployments, the respective GitHub action runs whenever a PR is opened that targets the `main` branch. When that workflow is triggered, the tests are excuted and will deploy when they pass. The library outputs will be deployed to a `next` folder in the bucket using the `deploy:staging` task in the `package.json` file.

_Note: Currently every new PR or updated PR will overwrite the previous deployment meaning that only one PR can be validated at a time. If multiple testing deployments are necessary, manually deploy the library by changing the `filePrefix` parameter in the npm script and run that command locally_

## Production

Production deployments are more strict than staging because it's important for them to be an active choice rather than an automatic deployment. To facillitate this, we use a project called [release-please](https://github.com/googleapis/release-please) to create releases for us. This project does a few things automatically for us to support production deployments:

- Generates changelog based on commit messages
- Increments version in `package.json` automatically
- Tag the commit with the new library version
- Create a GitHub release with those artifacts

### Development Process

A standard process for this is as follows:

- Developer opens PR targeting `main` branch
- PR is merged to `main`
- Production GitHub workflow runs which sees the new commit and performs steps listed above
- Changes are added to a new PR and opened automatically
  - This is called a release PR

From here there are two paths forward:

- Merge the PR right away which will commit the release changes and deploy to production
- Merge other PR's to `main` to continue to add to the release
  - Every additional merge to `main` will update the release PR automatically

Once the release PR is merged, the production GitHub action will:

- Run the deploy step to push the files to the s3 bucket
- Tag the commit with the new library version
- Create a GitHub release with those artifacts

_Note: This deployment ususally takes 5 minutes after a change in status._

## Major Version Increment

If deploying a new major version you need to manually update `publishedVersion` as well as the `filePrefix` parameter in the `deploy` task in the `package.json`.

_Note: These values refer to the folder name in the [AWS S3 Bucket](https://s3.console.aws.amazon.com/s3/buckets/apptentive-web-sdks/?region=us-east-1&tab=overview)._

### Manual deployment

If for some reason a manual deploy is necessary, a script can be run locally to push the assets to the S3 bucket:

```sh
$ npm run deploy
```
