const http = require("node:http");
// Common js, permite importa JSONs directamente
const dittoJSON = require("./pokemon/ditto.json"); // <- json con los pokemon

const processRequest = (req, res) => {
    const { method, url } = req;
    switch (method) {
        case "GET":
            switch (url) {
                case "/pokemon/ditto":
                    res.setHeader(
                        "Content-type",
                        "application/json; charset=utf-8"
                    ); // <- application/json porque vamos a imprimir un json

                    return res.end(JSON.stringify(dittoJSON)); // <- convertimos json a string antes de enviar

                default:
                    res.statusCode = 404;
                    res.setHeader("Content-type", "text/html; charset=utf-8");
                    res.end("<h1>404</h1>");
                    return;
            }
        case "POST":
            switch (url) {
                // Se usan llaves en este case, porque estamos declarando una variable, sino tendríamos un proble de scope
                case "/pokemon": {
                    // Instanciamos body
                    let body = "";
                    // escuchamos por el evento data, que se ejecuta cada que entra informacion
                    req.on("data", (chunk) => {
                        // llenamos el body con las porciones de dato
                        body += chunk.toString();
                    });
                    // evento end, se ejecuta luego de que termine de entrar informacion en el evento data
                    req.on("end", () => {
                        // creamos los datos que vamos a enviar en el post
                        const data = JSON.parse(body); // <- convertimos body en objeto json
                        res.writeHead(201, {
                            "content-type": "application/json; charset=utf-8",
                        });
                        res.end(JSON.stringify(data)); // <- enviamos la informacion como un json string
                    });
                    break;
                }
                default:
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
            }
    }
};
const server = http.createServer(processRequest);

server.listen(3000, () => {
    console.log(
        `server listening on port http://localhost:${server.address().port}`
    ); // <- imprimimos puerto
});
