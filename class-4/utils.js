import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

export function importJson(path) {
    return require(path);
}
