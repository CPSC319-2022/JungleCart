import * as fs from 'fs';
import * as path from 'path';

export default function ConfigLoader(dir: string) {
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
}
