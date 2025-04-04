import express, { json } from "express";
import { createMovieRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

// Creamos funcion que cree la app y le pasamos el movieModel como parametro, de esta forma podemos tener diferentes servidores, para trabajar diferentes contextos
export const createApp = ({ movieModel }) => {
    const app = express();
    app.disabled("x-powered-by");
    app.use(json());
    app.use(corsMiddleware());

    // Creamos el enrutador y le pasamos el Modelo, en esta caso va a ser para trabajar con mysql
    app.use("/movies", createMovieRouter({ movieModel }));

    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => {
        console.log(`Server listening on port: http://localhost:${PORT}`);
    });
};
