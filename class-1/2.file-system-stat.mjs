// File system
import { statSync } from "node:fs";

const stats = statSync("./archive.txt");
console.log(
    stats.isFile(), // si es un fichero
    stats.isDirectory(), // si es un directorio
    stats.isSymbolicLink(), // si es un enlace simbolico
    stats.size // tamaño en bytes
);
