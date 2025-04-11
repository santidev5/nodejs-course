import mysql from "mysql2/promise"; // <- importamos mysql2 con promesas

const config = {
    host: "localhost",
    user: "root",
    port: 3306,
    password: "admin",
    database: "moviesdb",
};

const connection = await mysql.createConnection(config); //<- creamos conexion

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase();

            // get genres ids from database using genre names
            const [genres] = await connection.query(
                // De esta forma evitamos inyecciones sql
                `SELECT id,name FROM genre WHERE LOWER(name) = ?`, //<- ? significa que vamos a pasar un parametro
                [lowerCaseGenre] // <- pasamos el genero como array para que lo comprenda como parametro mysql2
            );

            if (genre.length === 0) return [];

            // get the id from the firs genre result
            const [{ id }] = genres;

            // get all movies ids from database table
            // querya a movie_genres
            const [moviesByGenre] = await connection.query(
                `
                SELECT BIN_TO_UUID(movie.id) as id, movie.title, movie.year, movie.director, movie.duration, movie.poster, genre.name as genre, movie.rate 
                FROM movie 
                INNER JOIN movies_genres on movies_genres.movie_id = movie.id 
                INNER JOIN genre on genre.id = movies_genres.genre_id 
                WHERE movies_genres.genre_id = ? 
            `,
                [id]
            );

            // return results
            return moviesByGenre;
        }
        const [movies] = await connection.query(`
                SELECT BIN_TO_UUID(id) as id, title, year, director, duration, poster, rate 
                FROM movie
            `);
        return movies;
    }
    static async getById({ id }) {
        const [movie] = await connection.query(
            `
            SELECT BIN_TO_UUID(movie.id) as id,movie.title, movie.year, movie.director, movie.duration, movie.poster, genre.name as genre, movie.rate FROM movie
            INNER JOIN movies_genres on movies_genres.movie_id = movie.id INNER JOIN genre on genre.id = movies_genres.genre_id
            WHERE movie.id = UUID_TO_BIN(?)
            `,
            [id]
        );
        return movie[0]; // <- retornamos el primer resultado
    }
    static async create({ data }) {
        const {
            genre, // genre is an array
            title,
            year,
            duration,
            director,
            rate,
            poster,
        } = data;

        // creamos uuid con mysql
        const [uuidResult] = await connection.query("SELECT UUID() uuid");
        const [{ uuid }] = uuidResult; // <- lo extraemos del array del resultado

        // generemos string con los generos
        const genres = MovieModel._getGenresFormat(genre);

        // get genres ids
        const [genresIdResult] = await connection.query(`
            SELECT id FROM genre WHERE name in(${genres})
        `);

        const movies_genres = MovieModel._getGenresId(genresIdResult, uuid);

        // add movie and genres
        try {
            // el uuidsi podemos inyectarlo por medio de javascript, ya que lo estamos generando nosotros desde el codigo con mysql
            await connection.query(
                `
            INSERT INTO movie (id ,title, year, director, duration, poster, rate)
            VALUES (UUID_TO_BIN('${uuid}'),?,?,?,?,?,?)
            `,
                [title, year, director, duration, poster, rate]
            );

            await connection.query(`
            INSERT INTO movies_genres (movie_id, genre_id) VALUES ${movies_genres}
            `);
        } catch (e) {
            // puede enviar informacion sensible, el usuario no debe verlo
            throw new Error("Error creating movie");
            // Enviar la traza a unservicio interno
        }

        // get newMovie for showing
        const [movie] = await connection.query(
            `
            SELECT BIN_TO_UUID(id) as id,title, year, director, duration, poster, rate FROM movie
            WHERE id = UUID_TO_BIN(?)
            `,
            [uuid]
        );

        // First result
        return movie[0];
    }

    static async delete({ id }) {
        const result = await connection.query(
            `
            DELETE FROM movie WHERE id = UUID_TO_BIN(?)
            `,
            [id]
        );
        return result[0];
    }
    static async update({ id, data }) {
        const keyValues = Object.entries(data).reduce(
            (values, [key, value], i, array) => {
                values += `${key} = '${value}'${
                    i === array.length - 1 ? "" : ", "
                }`;
                return values;
            },
            ""
        );

        try {
            const result = await connection.query(
                `UPDATE movie SET ${keyValues} WHERE id = UUID_TO_BIN('${id}')`
            );
            console.log(result);
        } catch (e) {
            throw new Error("Error updating movie");
        }
    }
    static _getGenresFormat(genre = []) {
        return genre.reduce((genres, g, i, array) => {
            // se comprueba el indice para no agregar una coma despues del ultimo elemento
            genres += `"${g}"${i === array.length - 1 ? "" : ","}`;
            // convierto a lowerCase para evitar problemas de comparacion
            return genres.toLowerCase();
        }, "");
    }
    static _getGenresId(genresIdResult = [], uuid) {
        return genresIdResult.reduce(
            // usamos destructuring en el id porque viene como objeto
            (movies_genres, { id }, i, array) => {
                // se comprueba el indice para no agregar una coma despues del ultimo elemento
                movies_genres += `(UUID_TO_BIN('${uuid}'),${id})${
                    i === array.length - 1 ? ";" : ", "
                }`;
                // convierto a lowerCase para evitar problemas de comparacion
                return movies_genres;
            },
            ""
        );
    }
}
