import { MovieModel } from "../models/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movieSchema.js";

export class MovieController {
    static async getAll(req, res) {
        const { genre } = req.query;
        const movies = await MovieModel.getAll({ genre });
        res.json(movies);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const movie = await MovieModel.getById({ id });
        if (!movie) {
            return res.status(404).json({ msg: "movie not found" });
        }
        res.json(movie);
    }

    static async create(req, res) {
        const result = await validateMovie(req.body);
        if (!result.success) {
            return res.status(404).json({ msg: "Invalid format movie" });
        }
        const newMovie = await MovieModel.create({ data: result.data });
        res.json(newMovie);
    }

    static async delete(req, res) {
        const { id } = req.params;
        const result = await MovieModel.delete({ id });
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "movie not been deleted" });
        }
        res.status(200).json({ msg: "movie been deleted" });
    }

    static async update(req, res) {
        const result = await validatePartialMovie(req.body);
        if (!result.success) {
            return res.status(404).json({ msg: "Invalid format movie" });
        }
        const { id } = req.params;
        const updateMovie = await MovieModel.update({ id, data: result.data });
        res.json(updateMovie);
    }
}
