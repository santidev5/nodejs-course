const express = require('express') // <- importamos el framework
const dittoJSON = require('./pokemon/ditto.json') // <- json del pokemon

const PORT = process.env.PORT ?? 3000 // <- puerto desde las variables de entorno sino 3000

// Setting app
const app = express() // <- creamos la app
app.disable('x-powered-by') // <- deshabilitar encabezado de potenciado por express

// Middleware - Puede afectar a todas las peticiones o las que nosotrs decidamos, muchas suelen ser para todas las rutas
// app.use((req, res, next) => {
//   // si el mehtod no es post pasamos a la siguiente request
//   if (req.method !== 'POST') return next()
//   // Si el content-type no es application/json
//   if (req.headers['content-type'] !== 'application/json') return next()

//   // Aca solo llegan los request post y con un content type de application/json
//   let body = ''
//   req.on('data', chunk => {
//     body += chunk
//   })
//   req.on('end', () => {
//     const data = JSON.parse(body)
//     // mutar request y meter la inf en el req.body
//     req.body = data
//     next() // <- el next va con la respuesta
//   })
// })

// Todo lo que hicimos en el middleware, se puede simplificar con express
app.use(express.json()) // <- almacena chunks, muta la request, llena el req.body y manda el next

// Podemos imprimir un json directamnete
app.get('/pokemon/ditto', (req, res) => {
  // No defino status porque por defecto es el 200
  // Metodo json
  res.json(dittoJSON)
})

// POST
app.post('/pokemon', (req, res) => {
  res.status(201) // <- status 201
  // req.body deberíamos guardar en bbdd (bases de datos)
    .json(req.body) // <- enviamos como respuesta el req.body que llenamos en el middleware
})

// manejar 404, simepre va a lo ultimo
// el use aplica este callback para todas las acciones sea get o post
app.use((req, res) => {
  res.status(404).send('<h1>404 not fund</h1>')
})

// Escuchamos por el puerto y pasamos callback
app.listen(PORT, () => {
  console.log(
        `http://localhost:${PORT}`
  )
})
