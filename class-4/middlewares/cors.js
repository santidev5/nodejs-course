import cors from "cors";
// origenes acceptados
const ACCEPTED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://movies.com", // <- url de produccion
];

// Hacemos que la funcion pueda tomar origenes aceptados, pero por defectos son los que definimos acá
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
    cors({
        // metodo de cors para validar origenes
        origin: (origin, callback) => {
            // Array de rutas aceptadas
            if (acceptedOrigins.includes(origin)) {
                return callback(null, true); //<- permitimos cors y cors preflight
            }
            if (!origin) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
    });
