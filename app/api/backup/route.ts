import { NextRequest, NextResponse } from "next/server"
import archiver from "archiver"
import { spawn } from "child_process"
import path from "path"
import { mkdirSync, existsSync, createWriteStream, rmSync } from "fs"
import { env } from "process"

export async function GET(_: NextRequest) {
  try {
    const fecha = new Date().toISOString().split("T")[0]
    const tempDir = path.join("/tmp", `backup-${fecha}`)
    const backupPath = path.join(tempDir, "backup.zip")

    if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true })

    const host = env.DB_HOST || "localhost"
    const port = env.DB_PORT || "3306"
    const user = env.DB_USER || "root"
    const password = env.DB_PASSWORD || ""
    const dbname = env.DB_NAME || "ferreteria"

    const sqlPath = path.join(tempDir, `${dbname}.sql`)
    const dumpArgs = [`-h${host}`, `-P${port}`, `-u${user}`]

    if (password) {
      dumpArgs.push(`-p${password}`)
    }

    dumpArgs.push(dbname)

    const mysqldump = spawn("mysqldump", dumpArgs)
    const sqlFile = createWriteStream(sqlPath)
    mysqldump.stdout.pipe(sqlFile)

    await new Promise((resolve, reject) => {
      mysqldump.on("exit", (code) => (code === 0 ? resolve(true) : reject("mysqldump falló")))
    })

    const output = createWriteStream(backupPath)
    const archive = archiver("zip", { zlib: { level: 9 } })

    archive.pipe(output)
    archive.file(sqlPath, { name: `${dbname}.sql` })

    await archive.finalize()

    const buffer = Buffer.from(
      await import("fs/promises").then(fs => fs.readFile(backupPath))
    )
    const stream = buffer

    rmSync(tempDir, { recursive: true, force: true })

return new NextResponse(stream, {
  status: 200,
  headers: {
    "Content-Type": "application/zip",
    "Content-Disposition": `attachment; filename="backup_${fecha}.zip"`,
    "Content-Length": buffer.length.toString(),
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  },
})
  } catch (error: any) {
    console.error("Error generando backup:", error)
    return NextResponse.json({ error: "No se pudo generar el backup." }, { status: 500 })
  }
}
