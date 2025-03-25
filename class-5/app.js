import express, { json } from "express";
import { moviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

const app = express();
app.disabled("x-powered-by");
app.use(json());
app.use(corsMiddleware());

app.use("/movies", moviesRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
});
