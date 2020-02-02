import fs from "fs"
import lz4 from "lz4"

export default async function readIntoMap(file): Promise<Map<string, string[]>> {
    const data = await new Promise((resolve, reject) => fs.readFile(file, (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(lz4.decode(data).toString()));
    }));
    return new Map(Object.entries(data));
}