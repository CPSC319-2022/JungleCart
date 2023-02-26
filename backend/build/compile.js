import path from "path";
import {build} from "esbuild";
import {readdirSync} from 'fs';

const PATH_TO_LAYERS_IN = path.normalize('./src/layer');
const PATH_TO_LAYERS_OUT = path.normalize('./dist/layer');
const AWS_LAYER_PATH = path.normalize('/nodejs/node_modules/');

const PATH_TO_LAMBDAS_IN = path.normalize('./src/lambda');
const PATH_TO_LAMBDAS_OUT = path.normalize('./dist/lambda');

// compiles .ts lambdas into .js lambdas
await Promise.all(
    getTsFiles(PATH_TO_LAMBDAS_IN)
        .map((file) =>
            build({
                entryPoints: [path.join(PATH_TO_LAMBDAS_IN, file)],
                outdir: path.join(PATH_TO_LAMBDAS_OUT, file.slice(0, -3)),
            })
        )
);

// compiles .ts layers into .js layers
await Promise.all(
    getLayerSubdirs(PATH_TO_LAYERS_IN)
        .map((subdir) =>
            build({
                entryPoints: getTsFiles(path.join(PATH_TO_LAYERS_IN, subdir))
                    .map((file) => path.join(PATH_TO_LAYERS_IN, subdir, file)),
                outdir: path.join(PATH_TO_LAYERS_OUT, subdir, AWS_LAYER_PATH),
                bundle: true,
                platform: 'node',
            })
        )
);

function getTsFiles(lambdaDir) {
    return readdirSync(lambdaDir)
        .filter((file) => path.extname(file) === '.ts');
}

function getLayerSubdirs(layerDir) {
    return readdirSync(layerDir, {withFileTypes: true})
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
}
