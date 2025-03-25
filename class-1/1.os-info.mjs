// Siempre que importemos modulos nativos utilizamos el prefijo node:
import { platform, release, cpus, freemem, totalmem, uptime } from "node:os";
console.log("Informacion del sistema operativo");
console.log("--------------------------------------------");
console.log("nombre del sistema operativo", platform());
console.log("version del sistema operativo", release());
console.log("CPUs", cpus().length); // <-- escalar procesos en node
console.log("CPU Model", cpus()[0].model); // <-- escalar procesos en node
console.log("memoria libre", Math.round(freemem() / 1024 / 1024), "MB"); // dividimos por 1024 dos veces para obtener los megas
console.log("memoria total", Math.round(totalmem() / 1024 / 1024)); // dividimos por 1024 dos veces para obtener los megas
console.log("tiempo encendido", Math.round(uptime() / 60 / 60), "HS"); // horas
