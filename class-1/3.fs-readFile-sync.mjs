import { readFileSync } from "node:fs";

console.log("leyendo primer archivo");
// Por default retorna un buffer, por le pasamos la codificacion
const text = readFileSync("./archive.txt", "utf-8");
console.log(text);
// Esto se debería poder hacer mientras leemos el archivo
console.log("hacer cosas mientras lee el archivo");

console.log("leyendo segundo archivo");
const text2 = readFileSync("./archive2.txt", "utf-8");
console.log(text2);
