import { readFile } from "node:fs/promises";

// Le definimos que cuando termine de leer los dos archivos los muestre
// paralelizar asincronía
Promise.all([
    readFile("./archive.txt", "utf-8"),
    readFile("./archive2.txt", "utf-8"),
]).then(([text, text2]) => {
    console.log("primer texto", text);
    console.log("segundo texto", text2);
});
