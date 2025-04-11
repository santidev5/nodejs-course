import fs from 'node:fs/promises'
import path from 'node:path'

// Importamos picocolors - Agrega colores en la consola
import picocolors from 'picocolors' // <- sale de la carpeta node_modules

// Carpeta donde vamos a enlistar nuestros archivos
const folder = process.argv[2] ?? '.' // <- carpeta que pasamos como argumento a la hora de ejecutar el modulo

// Funcion para leer archivos de un directorio y mostrar cierta informacion
async function ls (folder) {
  let files

  // Usamos dos try catch porque son diferentes operaciones que pueden tener fallos separados, para manejar mejor los errores

  // Leer directorio
  try {
    // Get files, readdir lee los archivos de un directorio
    files = await fs.readdir(folder)
  } catch (error) {
    console.error(
      // Envolvemos el console.error en un color de picocolors, esto hará que se muestre rojo
      picocolors.red(`No se pudo leer el directorio ${folder}`)
    )
    process.exit(1) // <- 1 porque es un error
  }

  // Mapeamos las promesass de todos los archivos - esto lo hacemos en paralelo porque necesitamos la informacion de todos los archivos
  // map no espera el await en secuencial, lo hace en paralelo
  const filesPromises = files.map(async (file) => {
    // Carpeta del archivo
    const filePath = path.join(folder, file)
    let stats

    // Usamos trycatch para manejar errores
    try {
      // Obtener informacion del archivo
      stats = await fs.stat(filePath)
    } catch (error) {
      console.error(
        picocolors.red(
                    `No se pudo obtener la informacion del archivo ${file}`
        )
      )
      process.exit(1) // <- 1 porque es un error
    }

    // Obtenemos si es un directorio o no
    const isDirectory = stats.isDirectory()
    const fileType = isDirectory ? 'D' : 'F'
    const fileSize = stats.size.toString()
    const fileModified = stats.mtime.toLocaleString()

    // Con padEnd y padStart le agregamos espacios en blancos al principio o el final
    return `${picocolors.whiteBright(fileType)} ${picocolors.blue(
            file.padEnd(20)
        )} ${picocolors.greenBright(fileSize.padStart(10))} ${picocolors.yellow(
            fileModified
        )}`
  })

  // esperamos que se terminen de mapear todas las promesas, porque necesitamos que se termine de acceder a todos los valores - esto retorna un array
  const filesInfo = await Promise.all(filesPromises)

  // Imprimir archivos
  filesInfo.forEach((fileInfo) => {
    console.log(fileInfo)
  })
}
ls(folder)
