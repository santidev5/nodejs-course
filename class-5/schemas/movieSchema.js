import { z } from "zod";
const date = new Date();
const year = date.getFullYear();

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: "Movie title must be a string",
        required_error: "Movie title is required",
    }),
    year: z
        .number({
            invalid_type_error: "Movie year must be a number",
            required_error: "Movie year is required",
        })
        .int()
        .min(1890)
        .max(year),
    director: z.string({
        invalid_type_error: "Movie director must be a string",
        required_error: "Movie director is required",
    }),
    duration: z
        .number({
            invalid_type_error: "Movie duration must be a number",
            required_error: "Movie duration is required",
        })
        .int()
        .positive(),
    poster: z.string().url({
        invalid_type_error: "Movie poster must be a url format",
        required_error: "Movie poster is required",
    }),
    genre: z.array(
        z.enum([
            "Action",
            "Crime",
            "Drama",
            "Sci-Fi",
            "Adventure",
            "Romance",
            "Animation",
            "Biography",
            "Fantasy",
        ])
    ),
    rate: z.number().int().min(0).max(10).default(0),
});

export async function validateMovie(movie) {
    return await movieSchema.safeParseAsync(movie); // <- retorna object {success: true/false, data: object}
}
export async function validatePartialMovie(movie) {
    // .partial() hace que todas las propiedades del esquema sean opcionales, pero si aparecen en el input las valida
    return await movieSchema.partial().safeParseAsync(movie);
}
