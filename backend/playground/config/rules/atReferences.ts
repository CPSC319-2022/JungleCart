import { Condition, Effect, Rule } from '../../lib/types/rules.type';

/*
  Get the value from id via @id.
  If there are multiple matches, it returns the list of matches.
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
  The path does not have to start at the root.
*/
class AtReferences extends Rule {
  public tag = 'atReferences';

  private rootContext: object;
  public condition: Condition = (context: unknown, key: string): boolean => {
    if (!this.rootContext && typeof context == 'object' && context !== null) {
      this.rootContext = context;
    }

    return (
      typeof context === 'object' &&
      context !== null &&
      typeof context[key] === 'string' &&
      context[key].startsWith('@')
    );
  };

  public effect: Effect = (context: unknown, key: string): void => {
    if (typeof context !== 'object' || context === null) return;

    // generate path from value
    // "@stack.data.s3.name" becomes ['stack', 'data', 's3', 'name']
    const path: string[] = context[key].slice(1).split('.');

    const baseContexts: unknown[] = this.getValuesMatchingKey(
      path.shift() ?? ''
    );

    const values: unknown[] = [];

    for (const baseContext of baseContexts) {
      let currentContext: unknown = baseContext;
      let found = true;

      for (const subPath of path) {
        if (!currentContext || typeof currentContext !== 'object') {
          found = false;
          break;
        }
        currentContext = currentContext[subPath];
      }

      if (found && currentContext !== undefined) {
        values.push(currentContext);
      }
    }

    context[key] = values.length
      ? values.length > 1
        ? values
        : values.pop()
      : undefined;
  };

  private getValuesMatchingKey = (
    searchKey: string,
    context: object = this.rootContext
  ): unknown[] => {
    const values: unknown[] = [];

    const keys: string[] = Object.keys(context);
    for (let i = 0; i < keys.length; i++) {
      const key: string = keys[i];
      const value = context[key];

      if (key === searchKey) {
        values.push(value);
      } else if (typeof value === 'object' && value !== null) {
        values.push(...this.getValuesMatchingKey(searchKey, value));
      }
    }

    return values;
  };
}

export default new AtReferences();
