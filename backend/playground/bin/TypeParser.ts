import * as tsj from 'ts-json-schema-generator';
import * as fs from 'fs';
import * as path from 'path';

export default function typeParser(source: string, output: string) {
  const config: tsj.Config = {
    path: path.normalize(source),
    tsconfig: path.normalize('./tsconfig.json'),
    type: '*',
  };

  const schema: tsj.Schema = tsj
    .createGenerator(config)
    .createSchema(config.type);

  const schemaString: string = JSON.stringify(schema, null, 2);
  fs.writeFileSync(path.normalize(output), schemaString);
}
