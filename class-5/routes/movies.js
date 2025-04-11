import { Router } from "express";
import { MovieController } from "../controllers/movie.js";

// Funcion para retornar el movieRouter, este lo crearemos desde nuestro app.js
export const createMovieRouter = ({ movieModel }) => {
    const moviesRouter = Router();
    // Creamos la instancia del movieController
    const movieController = new MovieController({ movieModel: movieModel });

    moviesRouter.get("/", movieController.getAll);
    moviesRouter.post("/", movieController.create);

    moviesRouter.get("/:id", movieController.getById);
    moviesRouter.patch("/:id", movieController.update);
    moviesRouter.delete("/:id", movieController.delete);
    return moviesRouter;
};
