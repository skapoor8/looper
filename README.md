# Looper

An elist management app with a form builder for making customizable user preference forms

## Features

### Create elists and view subscribers

### Build a custom user preferences form for every elist

### Users can sign up at a public url

### Users can manage their own preferences at the self service portal

### Users can unsubscribe and re-subscribe at will

### Secured with authentication

## Implementation

1. Backend is implemented with Nest.js, an API framework for TypeScript
2. Data is stored in a MySQL database using Google CloudSQL for MySQL. I chose a relational database to be able to support granular analytics operations for elists.
3. MikroORM used for modeling domain entities, handling transactions and query building. I chose Mikro for it's first class TypeScript support, and since it exposes a knex like query builder for highly flexible queries.
4. Backend architecture is split into Entities, Controllers for organization
5. API is hosted as gen 2 GCP Cloud Function
6. Front-end is build in angular, and served with firebase
7. UI library used is Angular Material. I use prime-ng most frequently and wanted to try out angular material's API.
8. Front-end architecture is layered

- HttpServices are where network interactions happen
- Stores are injectable singleton services that share global state data
- DomainServices contain all operations on domain data, and are the points of access for it for the UI
- Presenters host any complex ui logic, state and view models that may need to be shared between components
- Components are merely responsible for rendering ui and registering event handlers
- Class-transformer and class-validator are used to transform shared data contracts into model classes, and to validate them

8. Form builder is implemented with Angular Reactive Forms using the ngx-reactive-form-class-validator and with custom form controls
9. Project is organized as a monorepo with shared interfaces using Nx

## Motivation

I wanted to experience full-stack engieering in an isomorphic TypeScript environment, as well as work with Angular Reactive Forms. I gained deep insight into the latter, and great appreciation for much of a productivity boost shared interfaces can be. I was also hoping to build a project that would allow me to experiment with micro-frontends.

Overall, my feeling is that the isomorphic TypeScript stack gives you a great boost when you go completely backendless, and use a serverside framework to interact with the data layer directly. or perhaps if you're using a NoSQL database. If you construct an API, and use ORMs with a relational database, classes can't be shared due to normalizaton and joins. So you might as well be using a different language if performance and/or ecosystem are a concern.

## Future Directions

- Experiment with micro-frontends to see how looper can be embedded into other peoples' websites and projects
- Make the theme and appearance of public elist pages / self-service portal more customizable
- Added static asset hosting with Google Cloud Storage
