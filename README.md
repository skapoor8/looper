# AzureFunctionApiMysqlTypeorm

## Todo

1. Fix routing
2. Fix data loading based on permissions

## Using NX

1. creating workspace X
2. configure - apps and libs via nx.json X
3. creating apps and libs
4. starting and stopping apps

questions

1. why do libs need package.json -> for local config? local scripts?
2. running scripts in packages from the project toplevel - rn running by going to project
3. issues when changing directory structure - expected path libs or something - issues was not running nx command line from project root
4. shared nodemodules vs separate by lib

## Using MikroORM

1. connecting
2. sharing entities? can't be done easily, object impedence mismatch
3. mikro config in db root
4. using cli with ts-node -> enable in config, less of a headache than compiling everything
5. migrations with cli
6. seeding data with cli
7. db dumps, imports and exports

lessons

1. setters for hidden props fuck things up
2. best way to serialize entities is manual. based on sub-entity initialization, you can control whether the prop serialized is named 'entity' or 'entityId'
3. debug: true in mikro config allows you to see queries being fired off
4. populateWhen: INFER in config ensures things aren't populated by default, avoid expensive joins

questions

1. Ref - doesn't seemt to work in toJSON
2. ts-morpth vs reflect-metadata for mikro - what are the differences
3. is the added complexity worth it...?
4. performance with mikro

pitfalls

1. typing for toObject is messed up
2. CORS errors cannot be caught:

```bash
Access to XMLHttpRequest at 'http://localhost:3333/api/users' from origin 'http://localhost:4200' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

GET http://localhost:3333/api/users net::ERR_FAILED 200
```

## Adding Azure Function

1. install @nestjs/azure-func-http
2. run the nest add command for the package via nx g: `npx nx g @nestjs/azure-func-http:nest-add --sourceRoot "apps/api/src" --rootDir "apps/api" --project "apps/api"` (adjustments are required since this doesn't work well for nx integrated repos)
3. move all generated files into the api directory
4. move function.json file into api/src
5. Alter base function route in the main.azure.ts file, in the route in function.json and also add the following to host.json:

```json
{
  "version": "2.0",
  "extensions": {
    "http": {
      "routePrefix": ""
    }
  }
}
```

6. Add tasks for building and serving... this bit was fine
7. Deploy - did not go well at all. Azure function deployment is very sensitive to folder structure, and did not like the nx folder structure. Could have set up ci with azure pipelines, but it seems insane to have to set up ci for deployment.

NOTE: will compile with webpack, not separate js files like the basic nest js azure setup

### Pitfalls

1. Running nest cli via nx: find nx capabilities for a package (source)[https://github.com/nrwl/nx/issues/3779]
2. Adding nest js cli if not enabled already: https://github.com/nrwl/nx/issues/4135

## Generating an angular project

Learning: material, setting up with nx, api base routes... ssr is a no go...

1. Generate angular project: `npx nx g @nrwl/ng:app`
2. Add material: `npx nx g @angular/material:ng-add`
3. Learned SSR is a no go because lots of libs do not handle ssr specific reqiirements 'platformBrowserDynamic'

## Switching to Google Cloud Platform

### Setting up Google CloudSQL for MySQL

1. Set up a VPC
2. Set up a VPC connector
3. Create a cloud for mysql instance, lowest capacity and low memory
4. Configure it to use private ip
5. For the function app you're about to deploy, give the service account the Cloud SQL Client role in IAM
6. while deploying google cloud function api, use the --vps-connector flag with the name of the connector you just set up. This will give your function app access to the cloud sql instance. This is an alternative to the zip based deployment shown in the official guide.
7. In your mysql config, let the host be the private IP listed in the cloud sql instance's overview

#### Connecting Locally for Scripting

1. Add your ip as an allowed address
2. Then just use the public ip to login with any mysql host

Source: https://cloud.google.com/sql/docs/mysql/connect-instance-cloud-functions

#### Pitfalls

You can use a socket at the function endpoint to communicate via public ip, without having to set up private ip. Didn't seem to work out with mikro orm config, might have been okay with just the mysql2 npm package.

### Deploying Nest.js

```bash

gcloud functions deploy func-looper --gen2 --region us-central1 --gen2 --runtime nodejs16 --trigger-http --entry-point funcLooper --source ./dist/apps/api --allow-unauthenticated --project looper-374421 --env-vars-file=apps/api/src/environments/.env.prod.yaml --vpc-connector=looper-connector

```

1. Alter nx build settings:

```json
"options": {
  "outputPath": "dist/apps/api",
  "main": "apps/api/src/main.ts",
  "tsConfig": "apps/api/tsconfig.app.json",
  "assets": ["apps/api/src/assets"],
  "externalDependencies": "all", // needed for gcp functions
  "outputFileName": "index.js", // needed for gcp functions
  "generatePackageJson": true // needed for gcp functions
},
```

2. Create deploy/serve command

```json
"serve": {
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          "npx nx run api:build && npx functions-framework --source=dist/apps/api --target=funcLooper"
        ]
      }
},
"deploy": {
  "executor": "@nrwl/workspace:run-commands",
  "options": {
    "commands": [
      "gcloud functions deploy func-looper --gen2 --region us-central1 --gen2 --runtime nodejs16 --trigger-http --entry-point funcLooper --source ./dist/apps/api --allow-unauthenticated --project looper-374421 --env-vars-file=apps/api/src/environments/.env.prod.yaml --vpc-connector=looper-connector"
    ],
    "color": true,
    "parallel": false
  }
},
```

3. Setting environment variables in function is accomplished via a yaml config file fed in via the cli ... be sure to not commit it to version control
4. Configure VPC connector via cli flag
5. Allow public access via --allow-unauthenticated flag
6. Alter main.ts in a nest js function like so:

```ts
const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);

  // enable cors
  app.enableCors();

  // return app.init();
  return app;
}

bootstrap().then(
  async (app) => {
    console.log('process.env.PORT:', process.env.PORT);
    const port = 3333;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/`);

    process.on('exit', () => app.close());
  },
  (e) => {
    Logger.log('Failed to start application');
    Logger.log(e);
    throw e;
  }
);

// run on gcloud function
http('funcLooper', server); // needs to match the function specified in the deploy command
```

NOTE: env.PORT cannot be 8080. Nest server should not start on the same port as cloud function i.e. 8080, or the nest server will fail to start

7. Serve locally via function-framework cli to confirm things will work in the function environment
8. Serve locally with: `npx nx run api:serve`
9. Deploy with `npx nx run api:deploy`

Source - NestJS + Cloud Functions: https://itnext.io/a-perfect-match-nestjs-cloud-functions-2nd-gen-nx-workspace-f13fb044e9a4

Pitfalls:

1. PORT env variable is used by default, so don't use it in main.js in nest projects

### Deploy Angular with Firebase

1. Create firebase project... connect it to the correct gcp project
2. Create a dedicated google analytics resource, PITA to fix later
3. Add angular fire package: `npx nx g @angular/fire:ng-add`
4. Add production configuration in src/environments/environment.prod.ts (make sure this file isn't committed to version control)
5. Add the following to build options in project.json to switch prod conf out with dev:

```json
"fileReplacements": [
  {
    "replace": "apps/client/src/environments/environment.ts",
    "with": "apps/client/src/environments/environment.prod.ts"
  }
]
```

6. Run the auto-generated deploy script to deploy: `npx nx run client:deploy`

### Firebase Auth

#### Setting up AngularFire

#### Using prebuilt auth UI

https://github.com/RaphaelJenni/FirebaseUI-Angular

#### User Roles and Permissions

##### Auhtenticating Functions w/ API Keys
