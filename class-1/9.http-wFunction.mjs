import http from "node:http"; // <- protocolo HTTP
import picocolors from "picocolors";
import { findAvailablePort } from "./10.free-port.mjs";

const server = http.createServer((req, res) => {
    console.log("request received"); // <- se ejecuta en el servidor
    res.end("Hola mundo");
});
// de esta forma ahcemos que el puerto se valido tambien para produccion, accediendo a nuestras variables de entorno
const decidePort = process.env.PORT ?? 3000;

// Como retorna una promesa la trabajamos con then
findAvailablePort(decidePort).then((port) => {
    // escuchamos el servidor en el puerto pasado como argumento
    server.listen(port, () => {
        console.log(
            `server listening on port ${picocolors.blue(
                `http://localhost:${server.address().port}`
            )}`
        );
    });
});
