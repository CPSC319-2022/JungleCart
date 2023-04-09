export type Condition = (key: string, value, context) => boolean;
export type Effect = (key: string, value, context) => unknown;
export type Rule = [Condition, Effect];

export default abstract class ConfigMap {
  private rules: Rule[] = [];
  protected context: object;

  public setContext = (context: object) => {
    this.context = context;
  };

  public apply = (context?: object) => {
    if (context) {
      this.setContext(context);
    }
    const applyRules = (key: string, value, context) => {
      this.rules.forEach(([condition, effect]) => {
        if (condition(key, value, context)) {
          effect(key, value, context);
        }
      });
    };

    this.traverse(this.context, applyRules);
  };

  protected addRule = (condition: Condition, effect: Effect) => {
    this.rules.push([condition, effect]);
    return this;
  };

  protected traverse = (context: object, callback?: Effect): unknown | void => {
    for (const [key, value] of Object.entries(context)) {
      if (callback) {
        callback(key, value, context);
      }

      if (value instanceof Array) {
        value.forEach((obj) => {
          if (typeof obj === 'object') {
            this.traverse(obj, callback);
          }
        });
      } else if (typeof value === 'object') {
        this.traverse(value, callback);
      }
    }

    return;
  };

  protected getValueFromKey = (searchKey: string): unknown => {
    const find = (key, value) => {
      if (key === searchKey) {
        return value;
      }
    };

    return this.traverse(this.context, find, true);
  };
}
