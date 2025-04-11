import z from "zod";

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: "Title must be a string",
        required_error: "Movie title is required",
    }),
    year: z.number().int().positive().min(1890),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url(),
    genre: z.array(
        z.enum([
            "Action",
            "Adventure",
            "Crime",
            "Comedy",
            "Drama",
            "Fantasy",
            "Horror",
            "Thriller",
            "Sci-Fi",
        ])
    ),
    rate: z.number().int().min(0).max(10),
});
export function validateMovie(movie) {
    return movieSchema.safeParse(movie); // <- retorna object resolve
}

export function validatePartialMovie(movie) {
    // Convierte en opcionales las keys del objeto modelo, si están presentes en el modelo que se recibe las valida
    return movieSchema.partial().safeParse(movie);
}
