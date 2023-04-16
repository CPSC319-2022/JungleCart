import * as path from 'path';
import * as fs from 'fs';
import { Condition, Effect, Rule } from '../../lib/types/rules.type';

/*
  Loads in all the json files within a directory and all its subdirectories.
  Uses the name of the file or directory as the key value for its contents.
  It appends 'd-' if it is a directory or appends 'f-' if it is a file.
 */
class LoadJsonFilesFromDir extends Rule {
  public tag = 'loadJsonFilesFromDir';

  public condition: Condition = (context: unknown, key: string): boolean => {
    return (
      typeof context === 'object' &&
      context !== null &&
      typeof context[key] === 'string' &&
      !!path.dirname(context[key]) &&
      fs.existsSync(path.dirname(context[key]))
    );
  };

  public effect: Effect = (context: unknown, key: string): void => {
    if (typeof context !== 'object' || context === null) return;
    context[key] = this.loadJsonFiles(context[key]);
  };

  private loadJsonFiles(directory): object {
    const result = {};
    const files: string[] = fs.readdirSync(directory);

    for (const file of files) {
      const filePath: string = path.join(directory, file);
      const stat: fs.Stats = fs.statSync(filePath);

      if (stat.isDirectory()) {
        result[`d-${file}`] = this.loadJsonFiles(filePath);
      } else if (stat.isFile() && path.extname(filePath) === '.json') {
        const content: string = fs.readFileSync(filePath, 'utf8');
        result[`f-${path.basename(file, '.json')}`] = JSON.parse(content);
      }
    }

    return result;
  }
}

export default new LoadJsonFilesFromDir();
