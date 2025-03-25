import fs from 'node:fs/promises'

// en los callbacks siempre el error es el primer parametro
// readdir permite leer un directorio

// Manejo del error con tryCatch, teniendo promises
fs.readdir('.')
  .then((files) => {
    files.forEach((f) => {
      console.log(f)
    })
  })
  .catch((err) => {
    console.log(err)
  })
