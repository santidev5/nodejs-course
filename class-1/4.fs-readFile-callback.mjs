// readFile es la forma asincrona para leer archivos
import { readFile } from 'node:fs'

console.log('leyendo primer archivo') // se ejecuta primero esto

// readFile asincrono acepta como tercer parametro un callback, el cual se ejecutará una vez se haya terminado de leer el texto
// en cuarto lugar esto
readFile('./archive.txt', 'utf-8', (err, text) => {
  console.log(text)
})

console.log('hacer cosas mientras lee el archivo') // luego esto

console.log('leyendo segundo archivo') // en tercer lugar esto

// en quinto lugar esto
readFile('./archive2.txt', 'utf-8', (err, text) => {
  console.log(text)
})

// De esta forma lo que hacemos es no frenar nuestro codigo mientras se procesa cierta informacion
