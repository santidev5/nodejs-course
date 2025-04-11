import { importJson } from "../utils.js";
import { randomUUID } from "node:crypto"; // <- crear id para las movies
const movies = importJson("./movies.json");

export class MovieModel {
    // Metodo para recuperar todas las peliculas
    // {genre} directamente del objeto req.query
    // getAll usamos async porque no siempre los datos van a llegar de forma instantanea
    static async getAll({ genre }) {
        if (genre) {
            const filteredMovies = movies.filter((movie) =>
                movie.genre.some((g) => g.toLowerCase() === genre)
            );

            if (filteredMovies.length > 0) {
                return filteredMovies;
            }
            return false;
        }
        return movies;
    }

    // Recuperar pelicula por id
    static async getById({ id }) {
        console.log(id);

        const movie = movies.find((movie) => movie.id === id);
        return movie;
    }

    // Crear pelicula
    static async create({ data }) {
        const newMovie = {
            id: randomUUID(), // <- creamos identificador unico
            // data va a tener el objeto que recibimos en el post, pero ya validado
            ...data, // <- extendemos con spread operator
        };
        movies.push(newMovie); // <- agregamos nueva pelicula a lo ultimo en el array de movies
        return newMovie;
    }

    // Eliminar una pelicula
    static async delete({ id }) {
        const movieIndex = movies.findIndex((movie) => movie.id === id);
        if (movieIndex === -1) return false;
        movies.splice(movieIndex, 1);
        return movies[movieIndex];
    }

    // Actualizar pelicula
    // extraemos el id y data del object resolve result, al validar la pelicula en el enrutador
    static async update({ id, data }) {
        const movieIndex = movies.findIndex((movie) => movie.id === id); // <- get index of movie in movies array from url id
        // if not found movieIndex
        if (movieIndex === -1) {
            return false;
        }
        // create updateMovie object
        const updateMovie = {
            // Usar asi el spread operator, nos permite modificar, donde las propiedades coincidan, los valores del primer objeto con el del segundo
            // extends log of movie
            ...movies[movieIndex],
            // overwrite new values
            ...data,
        };
        movies[movieIndex] = updateMovie; // <- actualizamos la pelicula en el array de movies
        return updateMovie;
    }
}
