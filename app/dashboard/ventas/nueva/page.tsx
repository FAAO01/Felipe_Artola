"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface Producto {
  id_producto: number
  nombre: string
  precio_venta: number
  stock: number
}

interface Cliente {
  id_cliente: number
  nombre: string
  apellido: string
}

interface ItemVenta {
  id_producto: string
  cantidad: string
  precio_unitario: string
}

export default function NuevaVentaPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [items, setItems] = useState<ItemVenta[]>([{ id_producto: "", cantidad: "1", precio_unitario: "" }])
  const [id_cliente, setIdCliente] = useState("")
  const [metodo_pago, setMetodoPago] = useState("efectivo")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await fetch("/api/productos")
        const resClientes = await fetch("/api/clientes")
        const dataProd = await resProd.json()
        const dataClientes = await resClientes.json()
        setProductos(dataProd.productos || [])
        setClientes(dataClientes.clientes || [])
      } catch (err) {
        console.error("Error cargando datos:", err)
      }
    }
    fetchData()
  }, [])

  const handleItemChange = (index: number, field: keyof ItemVenta, value: string) => {
    const nuevosItems = [...items]
    nuevosItems[index][field] = value
    if (field === "id_producto") {
      const prod = productos.find(p => p.id_producto === parseInt(value))
      if (prod) nuevosItems[index].precio_unitario = String(prod.precio_venta)
    }
    setItems(nuevosItems)
  }

  const agregarItem = () => {
    setItems([...items, { id_producto: "", cantidad: "1", precio_unitario: "" }])
  }

  const eliminarItem = (index: number) => {
    const nuevosItems = [...items]
    nuevosItems.splice(index, 1)
    setItems(nuevosItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payload = {
        id_cliente: parseInt(id_cliente),
        metodo_pago,
        productos: items.map(item => ({
          id_producto: parseInt(item.id_producto),
          cantidad: parseFloat(item.cantidad),
          precio_unitario: parseFloat(item.precio_unitario),
        })),
      }

      const res = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error desconocido")

      router.push("/dashboard/ventas")
    } catch (err: any) {
      setError(err.message || "Error al registrar venta")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = () => {
    router.push("/dashboard/ventas")
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Cliente</Label>
              <select
                value={id_cliente}
                onChange={(e) => setIdCliente(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Método de pago</Label>
              <select
                value={metodo_pago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-3 items-end">
                  <div>
                    <Label>Producto</Label>
                    <select
                      value={item.id_producto}
                      onChange={(e) => handleItemChange(index, "id_producto", e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Seleccione</option>
                      {productos.map(p => (
                        <option key={p.id_producto} value={p.id_producto}>
                          {p.nombre} – C${p.precio_venta}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleItemChange(index, "cantidad", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Precio unitario</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.precio_unitario}
                      onChange={(e) => handleItemChange(index, "precio_unitario", e.target.value)}
                      required
                    />
                  </div>

                  {items.length > 1 && (
                    <Button type="button" variant="destructive" onClick={() => eliminarItem(index)}>
                      Quitar
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={agregarItem}>
                + Agregar producto
              </Button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Venta"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={handleCancelar}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}