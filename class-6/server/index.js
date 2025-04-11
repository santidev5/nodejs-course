import express from "express";
import logger from "morgan";
import { Server } from "socket.io"; // <- dependencia para conexion bidireccional
import { createServer } from "node:http";
import { pool } from "../DB/DB.js";
const app = express();

const server = createServer(app); // <- servidor http

// io = in-out
// creamos servidor de socket.io
const io = new Server(server, {
    // podemos definir un tiempo para que se recupere la informacion cuando uno de los usuarios está desconectado
    connectionStateRecovery: {},
});

// Cuando el servidor de socket.io recibe una conexion
// los sockets van a ser las diferentes conexiones que puede recibir el servidor
io.on("connection", async (socket) => {
    console.log("an user has connected!");

    // Evento de cuando se desconecta un usuario
    socket.on("disconnect", () => {
        console.log("an user has disconnect!");
    });

    // cuando una conexion recibe un "new message", msg va a valer al valor que manda el cliente
    socket.on("new message", async (msg) => {
        let result;
        // Accedemos al username que obtenemos desde el cliente
        const username = socket.handshake.auth.username ?? anonymous;

        try {
            // Consulta SQL
            [result] = await pool.execute(
                "INSERT INTO messages (content, username) VALUES (?,?)",
                [msg, username]
            );
        } catch (e) {
            console.error(e);
            return;
        }
        // tenemos que emitir un msg a todos los demas usuarios desde el servidor
        io.emit("new message", msg, result.insertId.toString(), username); // <- respondemos con el servidor para que emita el mensaje a todos los usuarios
    });

    if (!socket.recovered) {
        // <- recuperar mensajes sin conexion
        try {
            const [results] = await pool.execute(
                "SELECT * FROM messages WHERE ID > ?",
                [socket.handshake.auth.lastMessageId ?? 0] // <- le pasamos el id del ultimo mensaje
            );
            results.forEach((row) => {
                io.emit(
                    "new message",
                    row.content, // <- Pasamos los mensajes que ya tenga el usuario
                    row.id.toString(), // <- Los id de los mensajes
                    row.username // <- el username del usuario
                );
            });
        } catch (e) {
            console.log(e);
            return;
        }
    }
});

app.use(logger("dev"));
app.get("/", (req, res) => {
    // procces.cwd -> ruta donde se inicializó el proceso
    res.sendFile(`${process.cwd()}/client/index.html`); // <- res.sendFile es para renderizar archivos
});

const PORT = process.env.PORT ?? 3000;

// Aca no escuchamos express, sino el server http
server.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
});
