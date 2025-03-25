// IMPORTS
import { Router } from "express"; // <- enrutador para responder los paths
import { MovieController } from "../controllers/movies.js";

// EXPORT AND CREATE MOVIES ROUTER
export const moviesRouter = Router(); // <- creamos el enrutador, con esto vamos a registrar las rutas

// ALL MOVIES, FILTER BY GENRE
// usamos async await ya que no sabemos de donde vienen los datos y no siempre va a ser instantaneo
moviesRouter.get("/", MovieController.getAll);

// CREAR MOVIE
moviesRouter.post("/", MovieController.create);

// MOVIE BY ID
moviesRouter.get("/:id", MovieController.getById); // <- el enrutador de express ya toma pasa por defecto los parametros req y res

// DELETE BY ID
moviesRouter.delete("/:id", MovieController.delete);

// UPDATE BY ID
moviesRouter.patch("/:id", MovieController.update);
