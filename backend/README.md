# JungleCart Team
*CPSC 319 Project | AWS*

If there are changes desired please reach out to **@ethanthoma**.

## Scripts

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

## Config Files

The project contains a directory that hosts all the config files: `config/`.
In here, there is one for each base stack (api, database, and layer).
These hold some values that help initialize the stacks—mainly their ids.

### @Param

You will notice there is a special object called `@PARAM`.
This informs you that this is a parameter store object on AWS SSM.
When stacks, including ones you create, wish to store string values onto the parameter store, be sure to use the format shown:

``{"@PARAM": {"ID": <your-parameter-id>, "NAME": <your-parameter-name>}}``

The name part of the parameter is used for loading them from SSM.
Parameters are used to communicate between stacks.
For example, the ApiStack stores the information of the RestApi in SSM so that the ServiceStack(s) can access it.

If you are create a new service stack and, as such, inherit from ServiceStack, it will automatically load all parameters in the config file for you, including the lambda environments you set for the stack.
However, in order for this to work, **you must make sure to add your stack to depend on the other stacks where these parameters are created**. 
For example, the ProductsStack loads parameters from the ApiStack and LayersStack and, thus, as the dependencies added in `bin/app.ts`. 

### @CONFIG_PATH

If you look at `config/lambda.json`, you will see the object `@CONFIG_PATH`.
This tells the App's configuration that the value is held in another config file.
This is useful for when you want to set the value in one place but still used in other places such as lambda environments.
When the App is being constructed, it will automatically load these values in for you.

### Creating your own

You may need to make your config files.
If you simply wish to add to one, just add it as you would to any json file.
However, if you want to add your own file and link it, you will have to add it on `cdk.json` under the deployment environment you want.
The file paths are automatically loaded for you.

## Adding Services

This application has multiple stacks as you can see in the `bin/app.ts` file. 
This file is what creates our application.
Once you have built your service stack, you will need to initialize it in this file.

### ServiceStackProps

There are three props defined in ServiceStackProps and one defined in EnvironmentStackProps that it inherits.

The EnvironmentStackProps prop is `environment`. 
This allows all stacks to know what deployment environment they are.
For example, it could be `dev` or `prod`. 
This is required for all stacks (as all stacks are either Environment or Service).

#### LayerConfigNames

The `layerConfigNames` prop takes in a list of names of layers as defined in the `config/layer.json`.
Currently, there is only one.
If you wish to create your own lambda layer:

1. create a directory for your layer under `src/layer/<your-dir>`
2. add any files you will need to access from your lambda function to your directory
3. in the `config/layer.json`, add the same values that the `SQL_LAYER` object uses
4. create the lambda layer construct in the `stacks/layers-stack.ts`
5. create the string parameter for the layer to make it exportable

After these steps are done, you can simply add the name to list and the ServiceStack will parse it for you.
You will use the ServiceStack function `getLayers()` which is found [below](#getlayers--).

#### api

The `api` prop is a boolean that indicates whether to allow the service to connect to the api layer.
If you don't set it or set it to false, it will not allow you to use the `addHttpMethod()` function in the ServiceStack as referred to [here](#addhttpmethod).
You will see in the `config/services.json`, it has an `API` tag.
You will have to set this to the rest api you wish to connect to.
In most cases, it will be the same api for all services, so you just copy from the ProductsStack.
However, if you wish to use a different api, you will need to create it:

1. create a new API in the `stacks/api-stack.ts`
2. create a new string parameter in the stack
3. set the configuration values in the `config/api.json` file
4. reference the parameter defined in the config file in the `config/service.json` for your service under the `API` tag

#### lambdaEnvironmentConfigNames

The `lambdaEnvironmentConfigNames` prop is similar to the first prop.
It takes in the names of the lambda environments that are defined in `config/lambda.json`.
To add a new configuration:

1. add the name of your environment
2. add the names of all the variable(s) 
3. set the value of the variable(s) to string, @PARAM, or @CONFIG_PATH

The ServiceStack will automatically parse these for you and add them to the `this.lambda_environment`.

*NOTE: as `this.lambda_environment` is a dictionary, setting the same variable to different values in different environments passed will use the value from the last environment.
If you wish to be able to have a map of environments to be similar in functionality as `layerConfigNames` and the `getLayers()` function, let @ethanthoma know.*

### ServiceStack

The ServiceStack is a wrapper stack for all services.
The ServiceStack does a lot of the heavy lifting for you.
As can be seen from the props defined above, there is easy ways to access the layers and environments you may need for your functions.
Follow the design of the ProductsStack in `src/products-stack.ts` if you are not sure.

#### ServiceLambda

The ServiceLambda construct is also a wrapper construct but for lambda functions.
It simply initializes a lot of values for you that *should* stay consistent.
All it requires is the file-name of your lambda.
The file-name routes to the `dist` directory which is why you need to build before you deploy.

There are four optional props for the lambda.
1. The `handler` prop lets you tell what function is the main function of your lambda file. By default, this is set to `handler()`
2. The `dir` prop lets you change the input directory. By default, this is set to `dist`
3. The `environment` prop sets the variables available to the lambda function via `process.env`. In the ServiceStack, there is a private helper function that translates lambda environment names into lambda environment maps for you.
4. The `layers` prop sets the layers that the lambda uses. Much like `environment`, the ServiceStack converts `config` references into `layers` for you.

The `environment` prop is handled by the constructor.
Ideally, you would create a new environment within the `config/layer.json` if you wish to make changes.
However, given the current design of the `lambda_environment`, you may wish to only pass in variables for a specific function.
In this case, you can do so by either replacing the `lambda_environment` with your own or you can edit the `lambda_environment` in place via `{...lambda_environment, <your-var>: <your-var-value>}`

### getLayers()

The `getLayers()` function can be left blank, take in a single string value holding a lambda layer's name, or a list of names.
If you leave the input blank, it will deploy all the layers to the lambda.

### addHttpMethod

This function takes in a `path` for your lambda, a list or string of the HTTP method(s) you want for that path, and the lambda function.
It will create the routing on the api instance you defined for you service in the `config/service.json`.
It returns `true` on successful add and `false` if failed.
It will let you set multiple paths.
However, the lambda itself will need routing for you to use the correct path.
You can do so via using the `sql-layer` in your function.

*Note: this function only fails if the `api` prop is not set/set to false*

### lambda function

When creating your own lambda function, here are some things to follow:

1. create the lambda within the `src/lambda` directory
2. if you wish to connect to the database or do custom routing you will need to import the sql layer
   - to do so, copy the import statement in `src/lambda/products-lambda.ts`
     - the path is different as AWS wants it to be this pathway
   - you cannot use `import`, you **must** use `requires`
3. your main handler function must export via `exports.handler()`
   - if you wish to change the name to something else, you **must** set the handler prop when defining your lambda in your stack
4. if stuck, look at the `src/lambda/products-lambda.ts` as it is fully functional

*NOTE: the database is currently initialized but tables are not which means queries will fail until they are.
Furthermore, the database is called `dev` so all queries to a table must follow `dev.<table name>`.*
