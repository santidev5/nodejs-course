import jwt from "jsonwebtoken"; // <- libreria para crear tokens
import { SECRET_JWT_KEY } from "./config.js"; // <- importamos el secret key

export async function generateTokens(user) {
    const token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET_JWT_KEY,
        { expiresIn: "1h" }
    ); //<- generamos el token
    const refreshToken = jwt.sign(
        { id: user._id, username: user.username },
        SECRET_JWT_KEY,
        { expiresIn: "7d" }
    ); //<- generamos el refresh token
    return { token, refreshToken }; //<- devolvemos el token y el refresh token
}

export async function validateAndUpdateTokens() {}
