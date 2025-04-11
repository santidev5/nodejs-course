import { MovieModel } from "../models/movie.js"; // <- modelo de peliculas, este sería el que interactue con la base de datos y recupere la informacion
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

// Recuperamos y procesamos la informacion y renderizamos la vista (un json o html)
export class MovieController {
    static async getAll(req, res) {
        const { genre } = req.query;
        const movies = await MovieModel.getAll({ genre });
        if (!movies) {
            return res.status(404).json({ msg: "genre not found" });
        }
        res.json(movies);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const movie = await MovieModel.getById({ id });
        if (!movie) {
            return res.status(404).json({ msg: "movie not found" });
        }
        res.status(200).json(movie);
    }

    static async create(req, res) {
        const result = validateMovie(req.body);

        if (!result.success) {
            return res.status(404).json({ msg: "movie format no valid" });
        }

        const newMovie = await MovieModel.create({ data: result.data });

        if (!newMovie) {
            return res.status(404).json({ msg: "movie couldn't be created" });
        }

        return res.status(200).json(newMovie);
    }

    static async delete(req, res) {
        const { id } = req.params;
        const result = await MovieModel.delete({ id });
        if (!result) {
            return res.status(404).json({ msg: "movie could not be deleted" });
        }
        res.json({ msg: "movie been deleted", result });
    }

    static async update(req, res) {
        const result = validatePartialMovie(req.body);
        if (!result.success) {
            return res.status(404).json({ msg: "movie format no valids" });
        }
        const { id } = req.params;
        const updateMovie = await MovieModel.update({ id, data: result.data });
        if (updateMovie === -1) {
            return res.status(404).json({ msg: "movie not found" });
        }
        res.status(200).json(updateMovie);
    }
}
