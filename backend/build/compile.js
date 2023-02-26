import path from "path";
import {build} from "esbuild";
import {readdirSync} from 'fs';

// compiles .ts lambdas into .js lambdas
await build({
    entryPoints: listTsFiles('./src/lambda'),
    outdir: './dist/lambda',
});

// compiles .ts layers into .js layers
await Promise.all(
    getLayerSubdirs('./src/layer')
        .map((subdir) =>
            build({
                entryPoints: listTsFiles(`./src/layer/${subdir}`),
                outdir: `./dist/layer/${subdir}/nodejs/node_modules/`,
                bundle: true,
                platform: "node",
            })
        )
);

// finds .ts files and adds their paths
function listTsFiles(lambdaDir) {
    return readdirSync(lambdaDir)
        .filter((file) => path.extname(file) === '.ts')
        .map((file) => lambdaDir + '/' + file);
}

function getLayerSubdirs(layerDir) {
    return readdirSync(layerDir, {withFileTypes: true})
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
}
