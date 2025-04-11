import express, { json } from "express"; // <- importar express

// no se pueden importar json en ecmascript module
// import movies from "./movies.json" assert { type: "json" }; // <- esta sintaxis no existe
// tampoco esta sintaxis está bien
// import movies from "./movies.json" with {type:"json"}; //<- como va a ser en un futuro

// Para importar un json hay dos formas verdaderamente
// import fs from "node:fs"; // <- importamos file system
// leemos el movies de forma sincrona y lo parseamos a un json
// const movies = JSON.parse(fs.readFileSync("./moives.json", "utf-8"));

// Leer un json en ESModules recomendado - Crear una funcion require
import { createRequire } from "node:module";
const require = createRequire(import.meta.url); // <- creamos la funcion require, el meta.url tiene la direccion del archivo actual
const movies = require("./movies/movies.json"); // <- desde la ruta actual busca el json

import cors from "cors"; // <- importamos cors
import { randomUUID } from "node:crypto"; // <- dependencia nativa para crear uuid
import { validateMovie, validatePartialMovie } from "./schemas/movies.js"; // <- schema con la validacion para las movies
const app = express(); // <- creamos app

app.use(json()); // <- middleware para capturar request y mutar el body del post, para poder acceder al req.body

app.use(
    cors({
        origin: (origin, callback) => {
            const ACCEPTED_ORIGINS = [
                "http://localhost:8080",
                "http://movies.com", // <- url de produccion
            ];
            if (ACCEPTED_ORIGINS.includes(origin)) {
                return callback(null, true);
            }
            if (!origin) {
                return callback(null, true);
            }
        },
    })
);

app.disable("x-powered-by"); // <- eliminamos cabecera de express, por seguridad

// Todos los recursos que sean MOVIES se identifica con /movies
app.get("/movies", (req, res) => {
    const { genre } = req.query; // <- accedemos al query request de la url (?genre=Action)

    if (genre) {
        // Filtramos las peliculas que en su propiedad genre
        // Preguntamos si algun genero del array de generos de la pelicula iterada es igual al genero de la url, lo pasamos a minusculas para evitar errores de busqueda
        const filteredMovies = movies.filter((m) =>
            m.genre.some((g) => g.toLowerCase() === genre)
        );

        // recuperar la pelicula
        if (filteredMovies.length > 0) {
            res.json(filteredMovies);
        } else {
            res.status(404).send("404 not found");
        }
    } else {
        return res.json(movies);
    }
});

app.post("/movies", (req, res) => {
    const result = validateMovie(req.body); // <- validamos el req.body

    if (!result.success) {
        // 422 Unprocessable Entity
        return res
            .status(400)
            .json({ error: JSON.parse(result.error.message) });
    }
    const newMovie = {
        id: randomUUID(), // uuid v4
        ...result.data, // <- extendes con el spred el objeto
    };

    // En base de datos
    // Esto no es rest porque estamos guardando el estado de la app en memoria
    movies.push(newMovie); //<- añadimos la nueva pelicula al json de peliculas

    res.status(201).json(newMovie); // <- actualizar caché del cliente, evitando crear una nueva request
});

// Metodo delete
app.delete("/movies/:id", (req, res) => {
    // Obtenemos id de la url
    const id = req.params.id;

    // Obtenemos indice de la pelicula en base al id de la url
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    // Si no se encuentra el indice
    if (movieIndex === -1) {
        return res.status(404).send("404 not found");
    }

    // Removemos del array la pelicula. Eliminamos desde el indice de la pelicula un elemento
    movies.splice(movieIndex, 1);
    return res.json({ msg: "Movie deleted" });
});

// Obtener pelicula por id, le decimos que en el link vamos a pasar un id con :id
// path-to-regexp <- un biblioteca que nos convierte rutas complicadas en expresiones regulares
app.get("/movies/:id", (req, res) => {
    const { id } = req.params; // <- accedemos a los parametros de la request para tomar ese id

    // recuperar la pelicula
    const movie = movies.find((m) => m.id === id); // buscamos la pelicula que tenga el mismo id que el de la url
    if (movie) return res.json(movie);

    // en caso de que no este la pelicula
    res.status(404).send("404 not found");
});

app.patch("/movies/:id", (req, res) => {
    const result = validatePartialMovie(req.body);
    console.log(result);

    if (!result.success) return res.status(400).json({ msg: result.error });

    const { id } = req.params;
    // Obtenemos el index para poderlo actualizar
    const movieIndex = movies.findIndex((movie) => movie.id === id.toString());

    // si el indice es menor a 0 significa que no encontró la pelicula
    if (movieIndex < 0)
        return res.status(404).json({ message: "Movie not found" });

    // Update movie va a la pelicula ya actualizada
    const updateMovie = {
        // Obtenemos la pelicula que queremos modificar en base al indice obtenido mediante la busqueda por su id, extraido de la url
        ...movies[movieIndex],

        // Reescribimos las propiedades que se hayan modificado
        ...result.data, // <- objeto con las propiedades modificadas y validado con el schema de zod
    };

    // Reescribimos la pelicula correspondiente, por la nueva pelicula
    movies[movieIndex] = updateMovie;
    return res.json(updateMovie);
});

const PORT = process.env.PORT ?? 3001; // <- PUERTO
// Escuchamos puerto
app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
});
