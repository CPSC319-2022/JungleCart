export type Condition = (context: unknown, key: string) => boolean;
export type Effect = (context: unknown, key: string) => unknown;

export abstract class Rule {
  public tag: string;
  public condition: Condition;
  public effect: Effect;
}
