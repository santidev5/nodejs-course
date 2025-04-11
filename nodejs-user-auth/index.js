import express, { json } from "express";
import jwt from "jsonwebtoken"; // <- libreria para crear tokens
import cookieParser from "cookie-parser"; // <- permite modificar cookies
import { PORT, SECRET_JWT_KEY } from "./config.js"; // <- importamos puerto
import { generateTokens } from "./tokens.js"; // <- importamos la funcion para generar tokens
import { UserRepository } from "./user-repository.js";
const app = express();

app.set("view engine", "ejs"); // <- configuramos motor de vistas

app.use(json()); //<- formateamos el body
app.use(cookieParser()); //<- parseamos las cookies

// Middleware para verificar el token
app.use((req, res, next) => {
	const token = req.cookies.access_token; //<- obtenemos el token de las cookies
	//añadimos informacion a la peticion, de esta forma podemos acceder a la sesion desde cualquier parte de la aplicacion
	req.session = { user: null };

	if (token) {
		try {
			const data = jwt.verify(token, SECRET_JWT_KEY); //<- verificamos el token
			req.session.user = data;
		} catch {}
	} else {
	}

	next(); // seguir a la siguiente ruta o middleware
});

app.get("/", (req, res) => {
	const { user } = req.session;
	if (!user) return res.render("index"); //<- si no hay usuario renderizamos la vista index.ejs sin el usuario

	res.render("index", { username: user.username }); //<- renderizamos la vista index.ejs y le pasamos el usuario
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await UserRepository.login({ username, password });

		// Creamos token para validar sesion del usuario
		const { token, refreshToken } = await generateTokens(user); // <- generamos los tokens
		console.log(refreshToken);

		// Guardamos el refresh token en la base de datos
		user.refreshToken = refreshToken; //<- guardamos el refresh token en la base de datos
		user.save(); //<- guardamos el usuario en la base de datos

		// Creamos nuevas cookies
		res
			.cookie("access_token", token, {
				httpOnly: true, //<- solo se puede acceder en el servidor
				secure: process.env.NODE_ENV === "production", //<- solo se puede acceder en produccion
				sameSite: "strict", //<- solo se puede acceder desde el mismo sitio
				maxAge: 1000 * 60 * 60, //<- tiempo de expiracion del token 1 hora
			})
			.cookie("refresh_token", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			})
			.status(200)
			.send({ user });
	} catch (e) {
		// Siempre que evitamos enviar todo el mensaje mejor
		res.status(401).send(e.message); // <- 401 es Unauthorized
	}
});

app.post("/register", async (req, res) => {
	const { username, password } = req.body; // <- el cuerpo de la peticion

	try {
		const id = await UserRepository.create({ username, password });
		res.status(201).send({ id }); //<- 201 es created
	} catch (e) {
		// Nos es buena idea enviar el error del repositorio
		res.status(400).send(e.message);
	}
});

// Cerra sesion
app.post("/logout", (req, res) => {
	// Aqui podríamos hacer una redireccion etc.
	res
		.clearCookie("access_token") //<- eliminamos la cookie del token
		.clearCookie("refresh_token") //<- eliminamos la cookie del refresh token
		.json({ message: "Logged out" }); //<- eliminamos la cookie del token
});

// Ruta protegida
app.get("/protected", async (req, res) => {
	const { user } = req.session; //<- obtenemos el usuario de la sesion
	if (!user) return res.status(402).send("Not authorized");
	res.status(200).render("protected", { username: user.username });
});

app.listen(PORT, () => {
	console.log(`Server is runing on port: http://localhost:${PORT}`);
});
