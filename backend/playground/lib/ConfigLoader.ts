import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core/lib/app';

export default class ConfigLoader {
  private readonly config;

  constructor(app: cdk.App) {
    const configDir = app.node.tryGetContext('config-dir');

    this.config = this.loadConfigDir(configDir);

    app.node.setContext('config', this.config);
  }

  private loadConfigDir = (dir: string) => {
    function loadJsonFiles(directory): object {
      const result = {};
      const files = fs.readdirSync(directory);

      for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          result[file] = loadJsonFiles(filePath);
        } else if (stat.isFile() && path.extname(filePath) === '.json') {
          const content = fs.readFileSync(filePath, 'utf8');
          result[path.basename(file, '.json')] = JSON.parse(content);
        }
      }

      return result;
    }

    return loadJsonFiles(dir);
  };

  private loadLambdas = () => {};
}

type Condition = (value) => boolean;
type Effect = (context, key: string, value) => void;
type Rule = [Condition, Effect];

class ConfigMap {
  private rules: Rule[] = [];

  constructor() {}

  public addRule = (condition: Condition, effect: Effect) => {
    this.rules.push([condition, effect]);
  };

  public traverse = (context: object) => {
    for (const [key, value] of Object.entries(context)) {
      let callback;

      for (let [condition, effect] of this.rules) {
        if (condition(value)) {
          callback = effect;
          break;
        }
      }

      if (Boolean(callback)) {
        callback(context, key, value);
      } else if (value instanceof Array) {
        value.forEach((obj) => {
          if (typeof obj === 'object') {
            this.traverse(obj);
          }
        });
      } else if (typeof value === 'object') {
        this.traverse(value);
      } else if (value === null) {
        delete context[key];
      }
    }
  };
}
