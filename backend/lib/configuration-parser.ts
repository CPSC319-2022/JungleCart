import * as path from "path";
import * as fs from "fs";

type JsonObject = { [key: string]: JsonDataTypes };
type JsonDataTypes = string | number | JsonObject | Array<JsonDataTypes> | boolean | null;

export function configurationParser(context: JsonObject) {
    parse(context);
}

function parse(context: JsonObject) {
    Object.entries(context).forEach(([key, value]) => {
        if (typeof value === "string" && path.extname(value) === ".json") {
            if (fs.existsSync(value)) {
                context[key] = JSON.parse(fs.readFileSync(value, "utf8"));
            } else {
                throw new Error(`configuration is missing file: ${value}`);
            }
        } else if (typeof value == "object") {
            if (value instanceof Array) {
                value.filter((elem): elem is JsonObject => (typeof elem == "object" && !(elem instanceof Array)))
                    .forEach(parse);
            } else if (value) {
                parse(value);
            }
        }
    });
}
