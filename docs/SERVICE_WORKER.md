# Service Worker

To manage the service worker releases (apps realease), we have two scripts; one of them make use of claim and the other one doesn't.

What _claim_ mean, basically, is that browser make a reload automatically. It means, the user not need do any action to get the new version.

## Use of claim (default)

With this behavior, the user does not need make any action to get the new version. The page will reload when new version received.

To build the app we use the next script:

```bash
npm run build:reloadclaim
```

## No use of claim

With no use of claim, we show to user a modal where accepting the new app version.

```bash
npm run build:reloadsw
```

## 🧪 Test service worker in local machine

To test service worker behavior on local machine, we have next command:

- With claim behavior

```bash
npm run dev:reloadsw-claim
```

- Without claim behavior

```bash
npm run dev:reloadsw
```

It´s needed have installed this server: [serve](https://www.npmjs.com/package/serve)

```bash
npm install -g serve
```

For each change which we make over code, we need run some of these command for web charge the new service worker
