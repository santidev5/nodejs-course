import { createApp } from "./app.js";
import { MovieModel } from "./models/mysql/movie.js";

// Creamos la app para mysql
createApp({ movieModel: MovieModel });
