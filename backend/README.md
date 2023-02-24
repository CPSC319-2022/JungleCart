# JungleCart Team
*CPSC 319 Project | AWS*

## Running

There are three functional scripts set up:
```
npm run build
npm run synth
npm run deploy
```

The script, ``build``, will compile both the layer and the lambda functions from *.ts* to *.js*. 
**Run this before deploying.**
It is currently only set to build the single lambda-layer *sql-layer*. 
If there are to be more layers added/required, it will be done through the *bin/compile.js*.

The script, ``synth``, will run cdk synth on the project.
This creates the Cloud Formation template.
**Run this to test if your code will compile correctly for AWS.**

The script, ``deploy`` will run cdk deploy and deploy it to the cloud.
At the moment, there is only one environment setup.
This means, it will push to production.
**DO NOT run this unless your code passes tests locally and your PR has been merged.**

## Adding Services

The project is structured that everything is contained within the DatabaseStack.
When creating a new service, you will have to create a new nested stack like the ProductsStack.
This means the lifecycle of the service is tied to the DatabaseStack.
It also means any changes to the service won't affect the deployment of other services.

The ProductsStack creates a new ServiceLambda whose path is set to *products-lambda*.
You will notice that the extension is not explicit as it actually links to the *dist* directory which is built from the *src* directory.
In the lambda function, you will notice it imports from the sql-layer the class Router and the function query.
This is why you need the sql-layer attached to your lambda function when you create it.

Follow the layout of the products-lambda.
If there are changes desired to the layout, please reach out to @ethanthoma.
It has a Router which follows the style of express for easy route management which is done in the layer.
Besides that, you will need to define the functions.
Base them on the examples provided in the file.

*NOTE: the database is currently not initialized which means queries will fail until it is. 
Furthermore, the database is called `backend` so all queries to a table must follow `backend.<table name>`.*
