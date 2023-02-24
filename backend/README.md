# JungleCart Team
*CPSC 319 Project | AWS*

If there are changes desired please reach out to @ethanthoma.

## Running

There are three scripts:
```
npm run build
npm run deploy
npm run deploy-all
```

### build

The script ``build`` compiles lambda functions and lambda layers from *.ts* to *.js* to the `dist` directory.
This compilation is done through the `build/compile.js` script and the esbuild API.
Afterwards, it will run `cdk synth` to create the CloudFormation templates.  
**Run this before deploying.**

### deploy

The script ``deploy`` takes in one parameter: the name of your stack. 
For example, if you want to deploy the `ProductsStack`, you would run:

``npm run deploy ProductsStack``

This will deploy your service stack to the cloud.
Furthermore, you can set the environment via

``npm run deploy ProductsStack --context env=dev``

There is only the `dev` environment setup at the moment but this may change.
It is also the default environment, so you can not include it when you run the script.  
**Run this to deploy your service stack.**

### deploy-all

The script, ``deploy-all`` will deploy all stacks to the cloud.
This was done for convenience when redeploying everything.   
**DO NOT RUN THIS.**

## Adding Services

This application has multiple stacks as you can see in the `bin/app.ts` file. 
This file is what creates our application.
Once you have build your service stack, you will need to initialize it in this file.

### ServiceStackProps

There are three props defined.
The `layerConfigNames` prop takes in a list of names of layers as defined in the `config/layer.json`.
Currently, there is only one.
If you wish to create your own lambda layer:
1. create the layer ts script in the `src/layer/<your-layer-name>`
2. add the required values to the config
3. create the lambda layer construct in the layers-stack
4. create the string parameter for the layer

The `api` prop just sets whether to allow the service to connect to the api layer.
If you don't set it or set it to false, it will not allow you to use the `addHttpMethod()` function.

The `lambdaEnvironmentConfigNames` prop is similar to the first prop.
It takes in the names of the lambda environments that are defined in `config/lambda.json`.
The config is a little complicated,
To add a new configuration:
1. add the name of your environment
2. add the names of all the variables
   - set the variable(s) to string if you want a static value
   - set the variable(s) to `{"CONFIG": <path>}` if it references another config
   - set the variables(s) to `{"KMS": <string | {"CONFIG": <path>}>}` if it uses KMS params

### ServiceStack

The ServiceStack is a wrapper.
If you look at the ProductsStack, which is a service, it inherits from it.
The ServiceStack does a lot of the heavy lifting for you.

#### ServiceLambda

Firstly, you can create lambdas using the ServiceLambda construct.
This too is a wrapper that presets a lot of the default behaviour, so you don't have to.
All it requires is the file-name of your lambda.
The file-name routes to the `dist` directory which is why you need to build before you deploy.

There are four optional props for the lambda.
1. The `handler` prop lets you tell what function is the main function of your lambda file. By default, this is set to `handler()`
2. The `dir` prop lets you change the input directory. By default, this is set to `dist`
3. The `environment` prop sets the variables available to the lambda function via `process.env`. In the ServiceStack, there is a private helper function that translates lambda environment names into lambda environment maps for you.
4. The `layers` prop sets the layers that the lambda uses. Much like `environment`, the ServiceStack converts `config` references into `layers` for you.

When creating these lambdas in your stack, be sure to use the ServiceStack helpers. 
The `environment` prop is handled by the constructor for now but, if you look at the ProductsStack example, there is a way to edit the lambda environment.

### getLayers()

The `getLayers()` function takes in the `config` name set for the lambda layer that you passed to the stack and converts it into a layer object.
If you leave the input blank, it will deploy all the layers to the lambda. 
You can just parse in the `config` name if you want one or a list of `config` names.

### addHttpMethod

This function takes in a `path` for your lambda, a list or string of the HTTP method(s) you want for that path, and the lambda function.

### lambda function

Follow the layout of the products-lambda.
You cannot use import as aws only allows requires.
Your handler function must export via `exports.handler()`.
You can connect to the database via the lambda layer.
It has a Router which follows the style of express for easy route management which is done in the layer.
The path to the lambda layer is different from what it is locally as per aws requirements.
Besides that, you will need to define your route functions.
Base them on the examples provided in the file.

*NOTE: the database is currently not initialized which means queries will fail until it is.
Furthermore, the database is called `dev` so all queries to a table must follow `dev.<table name>`.*

## Config files

Everything is mostly defined through the config files in the `config` directory.
Look at those for ideas on how to add you own.
The ServiceStack has a `this.config` for easy access to all functions if you set the id of the stack to match in the `services.json` config file.
If you wish to add a new configuration file, you will need to add it to the `cdk.json` under the environment you want it for.
The environment is set when you run the `deploy` script via the flag mentioned above.
The `cdk.json` accepts normal json as well as json files which are automatically loaded for you when run.
