// App para devolver un puerto disponible

import net from "node:net";

// Creamos una funcion que toma como parametro el puerto deseado
export function findAvailablePort(desiredPort) {
    // retornamos una promesa
    return new Promise((resolve, reject) => {
        // creamos un servidor
        const server = net.createServer();
        // le decimos que va a escuchar en el puerto deseado
        server.listen(desiredPort, () => {
            // destructuramos el objeto addres y obtenemos el puerto
            const { port } = server.address();
            // cerramos el servidor
            server.close(() => {
                // si todo salio ok nos devolverá el puerto
                resolve(port);
            });
        });
        // Escuchamos el error
        server.on("error", (err) => {
            // si el codigo de error es igual a que el puerto esta en uso
            if (err.code === "EADDRINUSE") {
                // pasamos el puerto 0 como parametro de la funcion para que nos retorne un puerto libre
                // como la funcion retorna una promesa lo trabajomos con then y resolvemos el puerto
                findAvailablePort(0).then((port) => resolve(port));
            } else {
                // en caso de cualquier otro error lo mostramos
                reject(err);
            }
        });
    });
}
