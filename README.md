<div align="center">
  <img src="./smile.png" />
</div>
<h1 align="center">Get Your Klangstof</h1>

This is the [Klangstof](https://klangstof.com) download code server. It's written in Typescript/Node and React. It's build as a modularized monolith using Domain Driven Design principles.

See it live at [getyour.klangstof.com](https://getyour.klangstof.com)

## How to use

The service relies on [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/), so use `yarn` if possible.

```bash
# Spin up development environment
git clone https://github.com/waspeer/get-your-klangstof.git
yarn
yarn dev 

# Production
yarn build
yarn start
```

## How does it work?

One of the biggest design requirements is that it's easy to use by the code redeemers as well as the band/management. For that reason I chose to use a Google Spreadsheet as the backend for the application, by means of [`node-google-spreadsheet`](https://github.com/theoephraim/node-google-spreadsheet). 

Since the G-Suite is already a big part of the tooling environment of the band, this application connects seamlessly with it. The tradeoff is that the writing/reading of data is rather slow, but in my opinion that's fine for an application that is not used on a regular basis by an individual user.

### Modules

The application has three distinct modules: **codes**, **mail** and **client**.

#### Codes

This module most heavily relies on Domain Driven Design principles as it is the core business logic of the application. The models/interfaces and business logic are found in the _domain_ layer, the exposed features are found the _application layer_ and the logic for hooking the features up to the infrastructure are found in the _infrastructure_ layer. In this case the features are hooked up to a REST api.

When a code is successfully redeemed an application-wide event is triggerred that can be consumed by the other modules, like, in this case, the _mail_ module.

#### Mail

This service responds to the `code.redeemed` event, triggerred inside the _codes_ module. It's build on top of [Nodemailer](https://github.com/nodemailer/nodemailer/) and [MJML](https://github.com/mjmlio/mjml)/[Handlebars](https://github.com/parcel-bundler/parcel). Because of the modularized architecture I've been able to reuse this module a few times already. Winning!

#### Client

The client is written in React. [Parcel](https://github.com/parcel-bundler/parcel) has been a real livesaver here. It's made it really easy to programmatically set up a dev environment and drastically reduce the time needed to set up the React/SPA pipeline. More time for the important things!

### Root

The root includes the main server class (`koa`). It collects all the middleware from the modules and registers the dependencies shared by the modules (`DomainEventEmitter` and `Logger`). I've grown really fond of [Awilix](https://github.com/jeffijoe/awilix) for the dependency injection. This layer also contains the interfaces for the application-wide events and the classes shared by the modules.

## Overengineered?

Maybe! :) But I like to take every chance to learn more about seperation of concerns and architecture. Plus, modularizing services like this enabled me to reuse almost entire modules. That's why we do it, right?

## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/) © Wannes Salomé
