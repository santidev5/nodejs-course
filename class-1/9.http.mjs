import http from "node:http"; // <- protocolo HTTP
import picocolors from "picocolors";

// Crear server con node nativo
// toma un callback con dos parametros, la request y la respuesta, las dos funciones que puede realizar un servidor
const server = http.createServer((req, res) => {
    console.log("request received"); // <- se ejecuta en el servidor
    res.end("Hola mundo");
});

// Donde tiene que escuchar el servidor
// escucha en el puerto 3000 y recibe un callback que va a ejecutar cuando empiece a esuchar
// puede ser que el puerto 3000 se esté usando, un  truco es usar el puerto 0, esto lo que hace es que va a utilizar el primer puerto que encuentre que esté disponible, esto es util para modo desarrollo
server.listen(0, () => {
    // Podemos recuperar el puerto en el que se está ejecutando el servidor con esta linea
    // server.address().port
    // Linea para que directamente nos cree el link para poder acceder
    console.log(
        `server listening on port ${picocolors.blue(
            `http://localhost:${server.address().port}`
        )}`
    );
});
