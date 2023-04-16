import { Condition, Effect, Rule } from '../../lib/types/rules.type';

class GroupLambdaConfigByStack extends Rule {
  public tag = 'groupLambdaConfigByStack';
  public condition: Condition = (context: unknown, key: string) => {
    return (
      key === 'd-src' &&
      typeof context === 'object' &&
      context !== null &&
      typeof context[key] === 'object'
    );
  };

  public effect: Effect = (context: unknown, key: string) => {
    if (typeof context !== 'object' || context === null) return;
    this.moveStackUp(context, key);
    const stack = {};
    this.loadStack(context[key], stack);
    context[key] = stack;
  };

  private moveStackUp = (context: object, key: string) => {
    const value = context[key];

    if ('stack' in value && !('type' in value) && key.startsWith('f-')) {
      context['stack'] = value['stack'];
      delete context[key];
    }

    for (const key in value) {
      if (typeof value[key] === 'object' && !Array.isArray(value[key])) {
        this.moveStackUp(value, key);
      } else if (Array.isArray(value[key])) {
        for (const k in value[key]) {
          this.moveStackUp(value[key], k);
        }
      }
    }
  };

  private loadStack = (context, stacks, currStack = '') => {
    if (Array.isArray(context)) {
      for (const obj of context) {
        this.loadStack(obj, stacks, currStack);
      }
    } else if (typeof context === 'object' && context !== null) {
      if ('stack' in context) {
        currStack = context['stack'];
      }

      if ('type' in context) {
        if (currStack !== '') {
          if (stacks[currStack]) {
            stacks[currStack].push(context);
          } else {
            stacks[currStack] = [context];
          }
        }

        delete context['stack'];
      }

      for (const key in context) {
        this.loadStack(context[key], stacks, currStack);
      }
    }
  };
}

export default new GroupLambdaConfigByStack();
