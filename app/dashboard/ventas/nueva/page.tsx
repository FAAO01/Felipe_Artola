"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

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
  const [montoRecibido, setMontoRecibido] = useState("")
  const [nota, setNota] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [impuestoRate, setImpuestoRate] = useState(0.18) // impuesto por defecto

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resClientes, resConfig] = await Promise.all([
          fetch("/api/productos"),
          fetch("/api/clientes"),
          fetch("/api/configuracion"),
        ])

        const dataProd = await resProd.json()
        const dataClientes = await resClientes.json()
        const config = await resConfig.json()

        setProductos(dataProd.productos || [])
        setClientes(dataClientes.clientes || [])

        const impuestoDecimal = Number(config.impuesto) / 100
        if (!isNaN(impuestoDecimal)) {
          setImpuestoRate(impuestoDecimal)
        }
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
    setItems(prev => [...prev, { id_producto: "", cantidad: "1", precio_unitario: "" }])
  }

  const eliminarItem = (index: number) => {
    const nuevosItems = [...items]
    nuevosItems.splice(index, 1)
    setItems(nuevosItems)
  }

  const calcularTotal = () =>
    items.reduce((acc, item) => {
      const cantidad = parseFloat(item.cantidad) || 0
      const precio = parseFloat(item.precio_unitario) || 0
      return acc + cantidad * precio
    }, 0)

  const total = calcularTotal()
  const totalConImpuesto = total * (1 + impuestoRate)
  const vuelto =
    metodo_pago === "efectivo" && parseFloat(montoRecibido) > 0
      ? parseFloat(montoRecibido) - totalConImpuesto
      : null

  const isEfectivoInsuficiente =
    metodo_pago === "efectivo" &&
    (montoRecibido.trim() === "" || parseFloat(montoRecibido) < totalConImpuesto)

  const isTransferenciaInvalida =
    metodo_pago === "transferencia" &&
    (!/^\d{12}$/.test(montoRecibido))

  const isTarjetaInvalida =
    metodo_pago === "tarjeta" &&
    (montoRecibido.trim().length !== 4 || !/^\d+$/.test(montoRecibido))

  const isNotaCreditoInvalida =
    metodo_pago === "credito" && nota.trim() === ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isEfectivoInsuficiente) {
      setError("El monto recibido en efectivo es menor al total a pagar.")
      return
    }
    if (isTransferenciaInvalida) {
      setError("El ID de transferencia debe ser exactamente 12 dígitos numéricos.")
      return
    }
    if (isTarjetaInvalida) {
      setError("Los últimos 4 dígitos de la tarjeta deben ser numéricos.")
      return
    }
    if (isNotaCreditoInvalida) {
      setError("Debe ingresar una observación o nota para la venta a crédito.")
      return
    }

    setLoading(true)
    try {
      const payload: any = {
        id_cliente: parseInt(id_cliente),
        metodo_pago,
        productos: items.map(item => ({
          id_producto: parseInt(item.id_producto),
          cantidad: parseFloat(item.cantidad),
          precio_unitario: parseFloat(item.precio_unitario),
        })),
      }

      if (metodo_pago === "transferencia" || metodo_pago === "tarjeta" || metodo_pago === "efectivo") {
        payload.estado = "pagado"
        if (metodo_pago === "transferencia") {
          payload.id_transferencia = montoRecibido
        } else if (metodo_pago === "tarjeta") {
          payload.ultimos4 = montoRecibido
        }
      } else if (metodo_pago === "credito") {
        payload.nota = nota
        payload.estado = "pendiente"
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

  return (
    <div className="w-full px-6 py-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Nueva Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
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

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="credito">Crédito</option>
                </select>
              </div>

              <div>
                <Label>
                  {metodo_pago === "transferencia"
                    ? "ID de Transferencia"
                    : metodo_pago === "tarjeta"
                    ? "Últimos 4 dígitos"
                    : metodo_pago === "credito"
                    ? "Observación o Nota"
                    : "Monto recibido"}
                </Label>
                {metodo_pago === "credito" ? (
                  <Input
                    type="text"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    required
                    placeholder="Ingrese una observación o nota"
                  />
                ) : (
                  <Input
                    type={metodo_pago === "efectivo" ? "number" : "text"}
                    value={montoRecibido}
                    onChange={(e) => setMontoRecibido(e.target.value)}
                    required={metodo_pago !== "efectivo"}
                    placeholder={
                      metodo_pago === "transferencia"
                        ? "ID de referencia (12 dígitos)"
                        : metodo_pago === "tarjeta"
                        ? "Ej: 1234"
                        : "C$0.00"
                    }
                    maxLength={metodo_pago === "transferencia" ? 12 : metodo_pago === "tarjeta" ? 4 : undefined}
                    pattern={metodo_pago === "transferencia" ? "\\d{12}" : metodo_pago === "tarjeta" ? "\\d*" : undefined}
                    inputMode={metodo_pago === "transferencia" || metodo_pago === "tarjeta" ? "numeric" : undefined}
                  />
                )}
              </div>
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

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
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
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => eliminarItem(index)}
                        className="mb-1"
                        aria-label="Quitar producto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={agregarItem}>
                + Agregar producto
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Subtotal: C${total.toFixed(2)}</p>
              <p>Impuesto ({(impuestoRate * 100).toFixed(0)}%): C${(total * impuestoRate).toFixed(2)}</p>
              <p><strong>Total: C${totalConImpuesto.toFixed(2)}</strong></p>
              {vuelto !== null && (
                <p className={`font-semibold ${vuelto < 0 ? "text-red-600" : "text-green-600"}`}>
                  {vuelto < 0
                    ? `Falta: C$${Math.abs(vuelto).toFixed(2)}`
                    : `Vuelto: C$${vuelto.toFixed(2)}`}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading ||
                  isTransferenciaInvalida ||
                  isTarjetaInvalida ||
                  isEfectivoInsuficiente ||
                  isNotaCreditoInvalida
                }
              >
                {loading ? "Registrando..." : "Registrar Venta"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => router.push("/dashboard/ventas")}
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
