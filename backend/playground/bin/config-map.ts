import ConfigMap, { Effect } from '../lib/ConfigMap';

export class DefaultConfigMap extends ConfigMap {
  constructor() {
    super();

    /*
      Get the value from id via @id.
      If there are multiple matches, it returns the first one found.
      Put the @ in front of the key in the config you wish to get the value for:

        {
          "lambda-id": "@id"
        }

      You can specify a path in the config, for example:

        {
          "s3-name": "@stack.data.s3.name"
        }

      If the path does not refer to an existing value,
      it will set it to undefined.
    */
    this.addRule(
      (key, value) => {
        return typeof value === 'string' && value.startsWith('@');
      },
      (key, value, context) => {
        // sets the value to undefined if not found
        context[key] = undefined;

        // generate path from value
        // "@stack.data.s3.name" becomes ['stack', 'data', 's3', 'name']
        const path: string[] = value.slice(1).split('.');

        // finds and sets the context
        const find = (
          subKey: string,
          subValue,
          subContext,
          currPath: string[]
        ) => {
          if (subKey === currPath.at(0)) {
            if (currPath.length === 1) {
              context[key] = subValue;
            } else {
              this.traverse(subValue, callback(currPath.slice(1)));
            }
          }
        };

        // wrapper to allow accumulators in the Effect of the rule
        // copy the array since objects are refs
        const callback =
          (path: string[]): Effect =>
          (key, value, context) =>
            find(key, value, context, Object.assign([], path));

        // starts the searching with the full path
        this.traverse(this.context, callback(path));
      }
    );
  }
}
