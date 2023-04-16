import { Condition, Effect, Rule } from './types/rules.type';

export default class ConfigMap {
  private context: object;
  private graph: { [name: string]: string[] } = {};
  private rules: { [name: string]: [Condition, Effect] } = {};

  public addRule = (rule: Rule, dependencies: string | string[] = []) => {
    this.addToRuleGraph(
      rule.tag,
      rule.condition,
      rule.effect,
      typeof dependencies === 'string' ? [dependencies] : dependencies
    );

    return rule.tag;
  };

  private addToRuleGraph = (
    key: string,
    condition: Condition,
    effect: Effect,
    dependsOn: string[] = []
  ): void => {
    for (const dep of dependsOn) {
      if (!this.graph[dep]) {
        this.graph[dep] = [];
      }
      this.graph[dep].push(key);
    }

    if (!this.graph[key]) {
      this.graph[key] = [];
    }

    this.rules[key] = [condition, effect];
  };

  public apply = (): void => {
    const appliedRules = new Set<string>();

    for (const [name, dependencies] of Object.entries(this.graph)) {
      for (const name of dependencies) {
        if (!appliedRules.has(name)) {
          this.applyRule(this.rules[name]);
          appliedRules.add(name);
        }
      }

      this.applyRule(this.rules[name])(this.context);
      appliedRules.add(name);
    }
  };

  private applyRule =
    (rule: [Condition, Effect]) =>
    (context: object): void => {
      const [condition, effect] = rule;

      for (const [key, value] of Object.entries(context)) {
        if (condition(context, key)) {
          effect(context, key);
        }

        if (Array.isArray(value)) {
          for (const obj of value) {
            if (typeof obj === 'object' && obj !== null) {
              this.applyRule(rule)(obj);
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          this.applyRule(rule)(value);
        }
      }
    };

  public setContext = (context: object): ConfigMap => {
    this.context = context;
    return this;
  };

  public getContext = (): object => {
    return this.context;
  };
}
