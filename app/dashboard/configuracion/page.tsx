"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, Shield } from "lucide-react"
import General from "./general/general"
import Roles from "./roles/roles"

export default function ConfiguracionPrincipal() {
  const [vista, setVista] = useState<"general" | "roles">("general")

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      {/* Pestañas tipo carpeta */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={vista === "general" ? "default" : "ghost"}
          onClick={() => setVista("general")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Configuración
        </Button>
        <Button
          variant={vista === "roles" ? "default" : "ghost"}
          onClick={() => setVista("roles")}
        >
          <Shield className="w-4 h-4 mr-2" />
          Roles
        </Button>
      </div>

      {/* Contenido dinámico */}
      {vista === "general" && <General />}
      {vista === "roles" && <Roles />}
    </div>
  )
}
