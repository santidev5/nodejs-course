import crypto from "node:crypto"; // <- crear id

// Repositorio local (como db)
import dbLocal from "db-local"; // <- db local que no sigue sql ni nada
import * as bcrypt from "bcrypt"; // <- hash password
import { SALT_ROUNDS } from "./config.js";
import { Validation } from "./Validation.js";

const { Schema } = new dbLocal({ path: "./db" }); //<- le pasamos el path donde va a guardar los archivos

// Schema con las propiedades que va a tener nuestro user
const User = Schema("User", {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

// Clase para gestionar los usuarios
export class UserRepository {
    static async create({ username, password }) {
        // Validacion (opcional: usar zod)
        Validation.username(username);
        Validation.password(password);

        // Asegurarse que el username no exista ya en la db
        const user = User.findOne({ username });

        if (user) {
            throw new Error("username already exists");
        }
        const id = crypto.randomUUID(); // <- generamos id

        // Hasheamos el password antes de guardarlo
        // hashSync bloquea el thread principal, por eso usamos has, la cual es asincrona
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // <- se usa desde variable config ya que no queremos que se sepa

        User.create({
            _id: id,
            username,
            password: hashedPassword,
        }).save();

        return id;
    }

    static async login({ username, password }) {
        Validation.username(username);
        Validation.password(password);

        const user = User.findOne({ username });
        if (!user) throw new Error("Username does not exist");

        // Validamos que coincidan los password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Password is invalid");

        // Forma 1 de quitar propiedaes a un objeto
        const { password: _, ...publicUser } = user;
        // Forma 2 de quitar propiedaes a un objeto
        // esta forma es más segura ya que controlamos que propiedades se van a mostrar
        // const publicUser = {
        //     username: user.username,
        // };

        // Devolvemos el usuario
        return publicUser;
    }
}
