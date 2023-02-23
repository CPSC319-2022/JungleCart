import {build} from "esbuild";
import fs from "fs";
import path from "path";

// compiles .ts lambdas into .js lambdas
await build({
    entryPoints: listTsFiles('./src/lambda'),
    outdir: './dist/lambda',
});

await Promise.all(listTsFiles('./src/layer').map((file) => {
    return build({
        entryPoints: [file],
        outdir: './dist/layer/nodejs/node_modules',
        bundle: true,
        platform: "node",
    });
}));

// finds .ts files and adds their paths
function listTsFiles(lambdaDir) {
    return fs.readdirSync(lambdaDir)
        .filter((file) => path.extname(file) === '.ts')
        .map((file) => lambdaDir + '/' + file);
}
