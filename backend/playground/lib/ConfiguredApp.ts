import * as cdk from 'aws-cdk-lib';
import ConfigLoader from './ConfigLoader';
import ConfigMap from './ConfigMap';

export type ConfiguredAppProps = cdk.AppProps & {
  map?: ConfigMap;
};

export default class ConfiguredApp extends cdk.App {
  constructor(props?: ConfiguredAppProps) {
    super(props);

    const configDir = this.node.tryGetContext('config-dir');

    const config = ConfigLoader(configDir);

    if (props?.map) {
      props.map.apply(config);
    }

    this.node.setContext('config', config);
  }
}
