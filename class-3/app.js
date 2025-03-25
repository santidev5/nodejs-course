const express = require("express"); // <- importar express
const movies = require("./movies/movies.json"); // <- importar json con las peliculas
const cors = require("cors"); // <- importamos cors
const crypto = require("node:crypto"); // <- dependencia nativa para crear uuid
const { validateMovie, validatePartialMovie } = require("./schemas/movies"); // <- schema con la validacion para las movies
const app = express(); // <- creamos app

app.use(express.json()); // <- middleware para capturar request y mutar el body del post, para poder acceder al req.body

// Middleware de cors, para solucionar CORS PRE-Flight
// app.use(cors()); // <- pone todo con un * por defecto, problematico porque permite todos los origins, util para practicas etc.
// Ahora tambien podemos configurar origenes
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
    // accedemos al origin de la cabecera, esta no se envía cuando la peticion es desde la misma url
    // const origin = req.header("origin");
    // // si el origen desde el que se intenta entrar esta en nuestra lista de aceptados o no existe un origen
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //     res.header("Access-Control-Allow-Origin", origin);
    // }

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
        id: crypto.randomUUID(), // uuid v4
        ...result.data, // <- extendes con el spred el objeto
    };

    // En base de datos
    // Esto no es rest porque estamos guardando el estado de la app en memoria
    movies.push(newMovie); //<- añadimos la nueva pelicula al json de peliculas

    res.status(201).json(newMovie); // <- actualizar caché del cliente, evitando crear una nueva request
});

// options, para trabajar metodos complejos
// app.options("/movies/:id", (req, res) => {
//     const origin = req.header("origin");
//     if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//         res.header("Access-Control-Allow-Origin", origin);
//         // Cabecera para permitir los diferentes metodos
//         res.header(
//             "Access-Control-Allow-Methods",
//             "GET, POST, PUT, PATCH, DELETE"
//         );
//     }
//     res.send("200");
// });

// Metodo delete
app.delete("/movies/:id", (req, res) => {
    // // Obtenemos origen desde los headers
    // const origin = req.header("origin");
    // // Si el origen pertence a nuestros origenes aceptados o no hay un origen
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //     res.header("Access-Control-Allow-Origin", origin);
    //     // Cabecera para permitir los diferentes metodos
    // }

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

const PORT = process.env.PORT ?? 3000; // <- PUERTO
// Escuchamos puerto
app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
});
