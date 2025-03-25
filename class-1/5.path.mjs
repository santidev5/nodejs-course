import path from "node:path";
console.log(path.sep); // retorna formato de separacion de las rutas en el sistema operativo - este varía segun el SO

// Unir rutas con path.join
const filePath = path.join("content", "subfolder", "test.txt"); // <- en windows = \content\subfolder\test.txt
// console.log(filePath);

const base = path.basename("/tmp/tino-secret-file/password.txt"); // <- retorna nombre del fichero = password.txt
// console.log(base);

const filename = path.basename("/tmp/tino-secret-file/password.txt", ".txt"); // <- nombre del fichero retirando la extension
// console.log(filename);

const extension = path.extname("image.jpg"); // <- extension del fichero, se usa bastante
// console.log(extension);
