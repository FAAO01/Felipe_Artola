import { NextRequest, NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import os from "os"
import { spawn } from "child_process"
//import { config } from "dotenv"
//config({ path: ".env.local" }) // Asegura que cargue tu .env.local

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("sqlFile") as File

    if (!file || (!file.name.endsWith(".sql") && file.type !== "application/sql")) {
      return NextResponse.json({ error: "Debe subir un archivo .sql válido" }, { status: 400 })
    }

    // Guardar el archivo temporalmente
    const tempDir = os.tmpdir()
    const tempPath = path.join(tempDir, `${randomUUID()}.sql`)
    const bytes = await file.arrayBuffer()
    await writeFile(tempPath, Buffer.from(bytes))

    // Leer variables de entorno
    const host = process.env.DB_HOST || "localhost"
    const port = process.env.DB_PORT || "3306"
    const user = process.env.DB_USER || "root"
    const password = process.env.DB_PASSWORD || ""
    const database = process.env.DB_NAME

    if (!database) {
      return NextResponse.json({ error: "Nombre de base de datos no definido" }, { status: 500 })
    }

    // Ejecutar el comando mysql para importar
    const args = [
      `-h${host}`,
      `-P${port}`,
      `-u${user}`,
      ...(password ? [`-p${password}`] : []),
      database,
    ]

    const mysql = spawn("mysql", args)
    mysql.stdin.write(Buffer.from(bytes))
    mysql.stdin.end()

    return new Promise((resolve) => {
      mysql.on("close", async (code) => {
        await unlink(tempPath)
        if (code === 0) {
          resolve(NextResponse.json({ message: "Restauración completada exitosamente" }))
        } else {
          resolve(NextResponse.json({ error: "Error al importar la base de datos" }, { status: 500 }))
        }
      })
    })
  } catch (err) {
    console.error("Error importando backup:", err)
    return NextResponse.json({ error: "Fallo al restaurar la base de datos" }, { status: 500 })
  }
}
