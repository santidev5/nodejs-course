// IMPORTS
import express, { json } from "express"; // <- importar express
import { moviesRouter } from "./routes/movies.js"; // <- enrutador de movies
import { corsMiddleware } from "./middlewares/cors.js"; // <- importamos funcion cors

// EXPRESS APP
const app = express(); // <- creamos app
app.disable("x-powered-by"); // <- eliminamos cabecera de express, por seguridad

// MIDDLEWARES
app.use(json()); // <- middleware para capturar request y mutar el body del post, para poder acceder al req.body
app.use(corsMiddleware()); // <- middle para trabajar cors

// ROUTES
app.use("/movies", moviesRouter); // <- cuando se accede a /movies cargamos todas las rutas que tenemos en moviesRouter

// PORT
// siempre usar desde variables de entorno para no tener incovenientes al hacer deployment
const PORT = process.env.PORT ?? 3000; // <- PUERTO

// escuchamos puerto
app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
});
