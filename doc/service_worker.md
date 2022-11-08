# Service Worker

To manage the service worker releases (apps realease), we have two scripts; one of them make use of claim and the other one doesn't.

What _claim_ mean, basically, is that browser make a reload automatically. It mean, the user not need do any action for get the new version.

## Not use of claim (default)

For build the app without use of claim, we need run the next script:

```bash
npm run build
```

once this done, we have a new prod version in **\*\***build**\*\*** folder.

To test the behavior in local enviroment, we need serve the app with ssl (you can use **\*\***\*\*\***\*\***[serve](https://www.npmjs.com/package/serve)**\*\***\*\*\***\*\***)

## Use of claim

With this behavior, the user not need make any action to get the new version. The page will reload when new version received.

To build the app we use the next script:

```bash
npm run build:reloadclaim
```

As without claim, we can test on local enviroment doing use of **_[serve](https://www.npmjs.com/package/serve)_**
