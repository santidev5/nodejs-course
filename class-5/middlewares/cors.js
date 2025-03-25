import cors from "cors";
const ACCEPTED_ORIGINS = ["http://localhost:3000", "http://localhost:3000"];
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
