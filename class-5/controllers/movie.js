import { validateMovie, validatePartialMovie } from "../schemas/movieSchema.js";

// Pasamos los metodos a arrow functions y utilizamos un constructor, para poder pasarle el modelo como parametro, de esta forma dependiendo la app que despleguemos podríamos usar un movieModel en local, otro con mongoDb, otro con MySQL, etc.
export class MovieController {
    constructor({ movieModel }) {
        this.movieModel = movieModel;
    }
    getAll = async (req, res) => {
        const { genre } = req.query;
        const movies = await this.movieModel.getAll({ genre });
        res.json(movies);
    };

    getById = async (req, res) => {
        const { id } = req.params;
        const movie = await this.movieModel.getById({ id });
        if (!movie) {
            return res.status(404).json({ msg: "movie not found" });
        }
        res.json(movie);
    };

    create = async (req, res) => {
        const result = await validateMovie(req.body);
        if (!result.success) {
            return res.status(404).json({ msg: "Invalid format movie" });
        }
        const newMovie = await this.movieModel.create({ data: result.data });
        res.json(newMovie);
    };

    delete = async (req, res) => {
        const { id } = req.params;
        const result = await this.movieModel.delete({ id });
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "movie not been deleted" });
        }
        res.status(200).json({ msg: "movie been deleted" });
    };

    update = async (req, res) => {
        const result = await validatePartialMovie(req.body);
        if (!result.success) {
            return res.status(404).json({ msg: "Invalid format movie" });
        }
        const { id } = req.params;
        const updateMovie = await this.movieModel.update({
            id,
            data: result.data,
        });
        res.json(updateMovie);
    };
}
