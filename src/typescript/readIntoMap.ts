import fs from "fs"
import lz4 from "lz4"
import path from "path"


export default async function readIntoMap(file): Promise<Map<string, string[]>> {
    const data = await new Promise((resolve, reject) => fs.readFile(path.join('distribution', file), (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(lz4.decode(data).toString()));
    }));
    return new Map(Object.entries(data));
}