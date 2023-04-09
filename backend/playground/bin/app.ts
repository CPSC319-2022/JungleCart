import ConfiguredApp from '../lib/ConfiguredApp';
import { DefaultConfigMap } from './config-map';
import TestStack from '../stacks/services/TestStack';
import ApiStack from '../stacks/ApiStack';

const app = new ConfiguredApp({ map: new DefaultConfigMap() });

console.log(app.node.tryGetContext('config'));

const apiStack = new ApiStack(app, 'ApiStack', {});

// const stack = new TestStack(app, 'mystack', {
//   env: {
//     region: 'us-east-1',
//     account: '846202041248',
//   },
// });
