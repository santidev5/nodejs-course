import { readFile } from "node:fs/promises"; // transforma el metodo readFile para que en lugar de que tome un callback, utilice promesas

console.log("leyendo primer archivo");

// trabajamos la promesa con then
readFile("./archive.txt", "utf-8").then((text) => {
    console.log(text);
});

console.log("hacer cosas mientras lee el archivo");

console.log("leyendo segundo archivo");

readFile("./archive2.txt", "utf-8").then((text) => {
    console.log(text);
});
