import { createApp } from "./app.js";
import { MovieModel } from "./models/local/movie.js";

// Creamos la app para mysql
createApp({ movieModel: MovieModel });
