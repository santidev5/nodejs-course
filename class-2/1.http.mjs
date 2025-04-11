import http from "node:http"; // <- Modulo nativo de node para HTTP
import fs from "node:fs"; // <- file system

// Esto sería el procesar del servidor
function processRequest(req, res) {
    // todo esto se ejecuta en el servidor

    // Colocamos el header fuera de los if ya que en este caso será igual para todos
    res.setHeader("Content-Type", "text/html; charset=utf-8"); // <- tipo de contenido, texto html y con una codificacion de utf-8 para que admita tildes

    // Si la url que hace la solicitud es /
    if (req.url === "/") {
        res.end("Hola mundo");
    } else if (req.url === "/image") {
        // Leemos la imagen
        // como parametro readFile toma el error y segundo el archivo
        // file va a ser un buffer de la imagen (representacion en binario de la imagen)
        fs.readFile("./gymcat.jpg", (err, file) => {
            // si hay un error
            if (err) {
                res.statusCode = 500;
                res.end("500 internal server");
            } else {
                // <- si no hay errores al leer la imagen
                res.setHeader("Content-Type", "image/jpg"); // <- el contenido es una imagen y le pasamos la extension de la misma
                // Cuando la imagen llega a la respuesta se convierte a una imagen, porque hemos establecido que el content-type es una imagen y cual extension tendrá
                res.end(file);
            }
        });
    } else if (req.url === "/contact") {
        res.end("Pagina de contacto");
    } else {
        res.statusCode = 404;
        res.end("Pagina no encontrada");
    }
}

// Creamos servidor, que recibe un callback
const server = http.createServer(processRequest);
const desiredPort = process.env.PORT ?? 3000; // <- accedemos a variable de entorno PORT

// Escuchar en el servidor, un puerto, recibe un callback
server.listen(desiredPort, () => {
    console.log(
        `server listening on port http://localhost:${server.address().port}` // <- imprimimos puerto
    );
});
