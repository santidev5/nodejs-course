const express = require('express') // <- importamos el framework
const dittoJSON = require('./pokemon/ditto.json') // <- json del pokemon

const PORT = process.env.PORT ?? 3000 // <- puerto desde las variables de entorno sino 3000

// Setting app
const app = express() // <- creamos la app
app.disable('x-powered-by') // <- deshabilitar encabezado de potenciado por express

// Middleware - Puede afectar a todas las peticiones o las que nosotrs decidamos, muchas suelen ser para todas las rutas
// Por ejemplo todas las url que comiencen en pokemon "/pokemon/**"
app.use((req, res, next) => {
  console.log('mi primer middleware')

  // trackear request a la database
  // revisar si el usuario tiene cookies

  next() // <- una vez que termine de ejecutar el proceso que le haya dicho, continuará, sino agregamos esto el codigo se dentría luego del middleware
})

// tambien podemos tener middlewares para un metodo en especifico
// app.get('/pokemon/**', (req, res, next) => [
//   console.log('middleware para metodo get')
//   // validar acceso
// ])

// Podemos imprimir un json directamnete
app.get('/pokemon/ditto', (req, res) => {
  // No defino status porque por defecto es el 200
  // Metodo json
  res.json(dittoJSON)
})

// POST
app.post('/pokemon', (req, res) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const data = JSON.parse(body)
    res.status(201) // <- status 201
      .json(data) // <- no hace falta volver a convertir a string como antes sino que mostramos directamente el json
  })
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
