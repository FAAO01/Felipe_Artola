import Link from "next/link"

export default function NoAutorizadoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <div className="max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
        <p className="text-gray-700 mb-6">
          No tenés permisos para acceder a esta sección del sistema.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}
