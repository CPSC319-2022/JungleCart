const { buildSync } = require('esbuild');
const fs = require('fs');
const path = require('path');

// compiles .ts lambdas into .js lambdas
buildSync({
    entryPoints: listTsFiles('./src/lambda'),
    outdir: './dist/lambda',
});

listTsFiles('./src/layer').map((file) => {
    buildSync({
        entryPoints: [file],
        outdir: './dist/layer/nodejs/node_modules',
        bundle: true,
        platform: "node",
    });
});

// finds .ts files and adds their paths
function listTsFiles(lambdaDir) {
    return fs.readdirSync(lambdaDir)
        .filter((file) => path.extname(file) === '.ts')
        .map((file) => lambdaDir + '/' + file);
}
