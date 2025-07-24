"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Rol {
  id_rol: number;
  nombre_rol: string;
}

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    contrasena: "",
    telefono: "",
    direccion: "",
    id_rol: 0,
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        
        console.log("🧠 Roles obtenidos:", data); // 👈 Log añadido

        if (data.success && Array.isArray(data.roles)) {
          setRoles(data.roles);
          if (data.roles.length > 0 && !form.id_rol) {
            setForm((prev) => ({ ...prev, id_rol: data.roles[0].id_rol }));
          }
        } else {
          setRolesError("No se pudieron cargar los roles.");
        }
      } catch (err) {
        console.error("❌ Error al cargar roles:", err); // 👈 Log añadido
        setRolesError("Error al cargar los roles.");
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "id_rol" ? Number(value) : value });
  };

  const isFormValid = () => {
    return (
      form.nombre.trim() !== "" &&
      form.apellido.trim() !== "" &&
      form.email.trim() !== "" &&
      form.usuario.trim() !== "" &&
      form.contrasena.trim() !== "" &&
      form.telefono.trim() !== "" &&
      form.direccion.trim() !== "" &&
      !!form.id_rol &&
      roles.length > 0 &&
      !rolesLoading &&
      !rolesError
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log("🔎 Datos del formulario enviados:", form); // 👈 Log añadido
      console.log("📤 Rol seleccionado:", form.id_rol);        // 👈 Log añadido

      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("📥 Status response:", res.status);          // 👈 Log añadido
      const data = await res.json();
      console.log("📩 Respuesta del backend:", data);          // 👈 Log añadido

      if (!res.ok) throw new Error();
      toast.success("✅ Usuario creado.");
      router.push("/dashboard/usuarios");
    } catch (err) {
      console.error("❌ Error al registrar usuario:", err);    // 👈 Log añadido
      toast.error("❌ Error al registrar usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar nuevo usuario</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["nombre", "apellido", "email", "usuario", "contrasena", "telefono"].map((field) => (
            <div key={field}>
              <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                name={field}
                type={field === "contrasena" ? "password" : "text"}
                value={(form as any)[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <Label>Dirección</Label>
            <Input name="direccion" value={form.direccion} onChange={handleChange} />
          </div>

          <div className="md:col-span-2">
            <Label>Rol</Label>
            {rolesLoading ? (
              <div className="text-sm text-muted-foreground">Cargando roles...</div>
            ) : rolesError ? (
              <div className="text-sm text-red-500">{rolesError}</div>
            ) : (
              <select
                name="id_rol"
                value={form.id_rol}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre_rol} - {rol.id_rol} {/* 👈 Visibilidad extra */}
                  </option>
                ))}
              </select>
            )}
          </div>

          <Button
            className="md:col-span-2 mt-4"
            disabled={loading || !isFormValid()}
            onClick={handleSubmit}
          >
            {loading ? "Guardando..." : "Registrar usuario"}
          </Button>

          <Button
            variant="outline"
            className="md:col-span-2"
            onClick={() => router.push("/dashboard/usuarios")}
          >
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}