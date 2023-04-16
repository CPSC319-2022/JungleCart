import * as cdk from 'aws-cdk-lib';

import ConfigMap from '../lib/ConfigMap';
import {
  atReferences,
  loadJsonFilesFromDir,
  groupLambdaConfigByStack,
} from '../lib/Rules';

import ConfiguredApp from '../lib/ConfiguredApp';

import typeParser from './TypeParser';

import TestStack from '../stacks/services/TestStack';
import ApiStack from '../stacks/ApiStack';
import * as util from 'util';

typeParser('./playground/type/**/*.ts', './playground/config/type/types.json');

const map = new ConfigMap();
const r = map.addRule(loadJsonFilesFromDir);
map.addRule(atReferences, r);
map.addRule(groupLambdaConfigByStack, r);

const app: cdk.App = new ConfiguredApp({ map: map });

console.log(util.inspect(app.node.tryGetContext('config'), false, null, true));

const apiStack = new ApiStack(app, 'ApiStack', {});

// const stack = new TestStack(app, 'mystack', {
//   env: {
//     region: 'us-east-1',
//     account: '846202041248',
//   },
// });
