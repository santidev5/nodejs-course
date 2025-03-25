// Uso de async-await con common js
const { readFile } = require("node:fs/promises");

// Vamos a necesitar funcion IIFE function
(async function () {
    console.log("leyendo primer archivo");

    // trabajamos la promesa con then
    const text = await readFile("./archive.txt", "utf-8");
    console.log(text);

    console.log("hacer cosas mientras lee el archivo");

    console.log("leyendo segundo archivo");

    const text2 = await readFile("./archive2.txt", "utf-8");
    console.log(text2);
})();
