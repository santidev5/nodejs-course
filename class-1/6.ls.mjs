import fs from "node:fs";

// en los callbacks siempre el error es el primer parametro
// readdir permite leer un directorio
fs.readdir(".", (err, files) => {
    if (err) {
        console.log("error: ", console.error);
        return;
    }

    // Imprimimos ficheros de la carpeta actual
    files.forEach((f) => {
        console.log(f);
    });
});
