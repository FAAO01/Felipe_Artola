"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion: string;
  funciones: string; 
  fecha_creacion: string;
  nivel_acceso: string | number; 
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        console.log("Respuesta de /api/roles:", data);

        if (data.success && Array.isArray(data.roles)) {
          setRoles(data.roles);
        } else {
          setError("No se pudieron cargar los roles correctamente.");
        }
      } catch (err) {
        console.error("Error cargando roles:", err);
        setError("Ocurrió un error al conectar con el servidor.");
      }
    };

    fetchRoles();
  }, []);

  const handleEditar = (id: number) => {
    router.push(`/`);
  };

  const handleNuevoRol = () => {
    router.push("/dashboard/configuracion");
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>Gestión de Roles</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualizá los roles del sistema y las funciones que tienen asignadas.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!error && roles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay roles registrados.</p>
        ) : (
          roles.map((rol) => (
            <div
              key={rol.id_rol}
              className="p-4 border rounded-md hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{rol.nombre_rol}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {rol.descripcion || "Sin descripción"}
                  </p>

                  {/* Nivel de acceso */}
                  <p className="text-xs text-gray-500 mt-1">
                    Nivel de acceso:{" "}
                    <Badge variant="secondary" className="ml-1 text-[11px]">
                      {String(rol.nivel_acceso).toUpperCase()}
                    </Badge>
                  </p>

                  {/* Funciones */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(rol.funciones || "")
                      .split(",")
                      .map((funcion: string) => (
                        <Badge
                          key={funcion}
                          variant="outline"
                          className="text-xs capitalize"
                        >
                          {funcion.trim()}
                        </Badge>
                      ))}
                  </div>

                  {/* Fecha de creación */}
                  <p className="text-xs text-gray-500 mt-2">
                    Creado:{" "}
                    {new Date(rol.fecha_creacion).toLocaleDateString("es-NI", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

