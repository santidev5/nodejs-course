const z = require("zod");

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: "Movie title must be a string",
        required_error: "Movie title is required.",
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url({
        message: "Poster must be a valid URL",
    }),
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
        ]),
        {
            required_error: "Movie genre is required.",
            invalid_type_error: "Movie genre must be an array of enum Genre",
        }
    ),
    rate: z.number().min(0).max(10).default(0), //<- valor por default 0
});

function validateMovie(input) {
    return movieSchema.safeParse(input); //<- retorona object resolve
}

function validatePartialMovie(object) {
    // partial() lo que hace es que cada una de las propiedades de nuestro schema sean opcionales y si están las valida
    return movieSchema.partial().safeParse(object);
}

module.exports = {
    validateMovie,
    validatePartialMovie,
};
