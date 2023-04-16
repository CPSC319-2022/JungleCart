import * as cdk from 'aws-cdk-lib';
import ConfigMap from './ConfigMap';

export type ConfiguredAppProps = cdk.AppProps & {
  map?: ConfigMap;
};

export default class ConfiguredApp extends cdk.App {
  constructor(props?: ConfiguredAppProps) {
    super(props);

    const getContext = this.node.tryGetContext('config');

    if (typeof getContext === 'object') {
      if (props?.map) {
        props.map.setContext(getContext).apply();
      }

      this.node.setContext('config', getContext);
    } else {
      const configWrapper = { config: getContext };

      if (props?.map) {
        props.map.setContext(configWrapper).apply();
      }

      this.node.setContext('config', configWrapper.config);
    }
  }
}
