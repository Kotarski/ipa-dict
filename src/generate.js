const glob = require("glob");
const fs = require('fs');
const readline = require('readline');
const path = require('path');

function mkdirs(newPath) {
    return newPath.split(path.sep).reduce((prev, curr) => {
        const newDir = path.join(prev, curr);
        if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);
        return newDir;
    }, '')
}

const dataDirPath = "data";
const genEntriesDirPath = mkdirs("generated_entries");
const genDataGenPath = mkdirs("generated_data");

function getTemplatedFile(relativeImportPaths) {
    const lines = [].concat(relativeImportPaths.map((relativeImportPath, i) => `import json${i} from "${relativeImportPath}";`));
    lines.push(`const merged = [].concat(${relativeImportPaths.map((_, i) => `Object.entries(json${i})`).join(',')});`);
    lines.push(`export default new Map(merged);`)
    return lines.join('\n');
};

const CHUNKSIZE = 100000;

async function rewriteDataToJson(inputDataPath, dataOutDir) {
    const dataChunks = await new Promise((resolve, reject) => {
        const dataChunks = [];
        let currentDataChunk = {};
        let lineNo = 1; // doesn't really matter but 0 interferes with modulo

        readline.createInterface({
            input: fs.createReadStream(inputDataPath, 'utf8')
        }).on('line', line => {
            const [key, ...value] = line.split(/\t|,/);
            currentDataChunk[key] = value;
            if (lineNo % CHUNKSIZE === 0) {
                dataChunks.push(currentDataChunk);
                currentDataChunk = {};
            }
            lineNo++;
        }).on('close', () => {
            dataChunks.push(currentDataChunk);
            resolve(dataChunks);
        });
    });

    const outputDataPathPromises = dataChunks.reduce((outputDataPathPromises, dataChunk, chunkIndex) => {
        const outputDataPath = path.posix.format({
            dir: dataOutDir,
            name: `${path.basename(inputDataPath, '.txt')}_${chunkIndex}`,
            ext: '.json'
        });

        outputDataPathPromises.push(new Promise((resolve, reject) => {
            fs.writeFile(outputDataPath, Buffer.from(JSON.stringify(dataChunk)), err => err ? reject(err) : resolve(outputDataPath));
        }))

        return outputDataPathPromises;
    }, []);

    const outputDataPaths = await Promise.all(outputDataPathPromises);

    return outputDataPaths;
}

async function processDataPath(dataPath, entriesOutDir, dataOutDir) {
    const outputEntryPath = path.posix.format({
        dir: entriesOutDir,
        name: path.basename(dataPath, '.txt'),
        ext: '.js'
    });

    const outputDataPaths = await rewriteDataToJson(dataPath, dataOutDir);



    const relativeImportPaths = outputDataPaths.map(outputDataPath => path.posix.relative(entriesOutDir, outputDataPath));

    const entryPromise = new Promise((resolve, reject) => {
        fs.writeFile(outputEntryPath, getTemplatedFile(relativeImportPaths), err => err ? reject(err) : resolve(outputEntryPath));
    });

    return entryPromise;


}


glob(path.join(dataDirPath, "*.txt"), {}, (err, dataPaths) => {
    if (err) throw new err;
    Promise.all(dataPaths.map(dataPath => processDataPath(dataPath, genEntriesDirPath, genDataGenPath))).then(() => console.log("done"))
});

