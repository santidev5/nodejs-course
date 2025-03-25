// Objeto process - tiene propiedades y metodos con el proceso actual

// Argumentos de entrada
console.log(process.argv) // <- retorna algo como lo de abajo
// [
//     "C:\\Program Files\\nodejs\\node.exe",
//     "D:\\vscode\\curso-nodejs\\7.process.mjs",
//     "curso",
//     "nodejs",
// ];

// controlar proceso y su salida
// process.exit(1); // <- 0 todo ha ido bien, 1 hubo algun error

// controlar eventos del proceso
process.on('exit', () => {
  // Limpiar los recursos
})

// current working directory
// console.log(process.cwd()); // <- nos muestra desde el directorio que se ejecuta el proceso

// platform
// $env:NAME="santino"; node 7.process.mjs
// console.log(process.env.NAME); // <- acceder a las variables de entorno, en este caso variable NAME
