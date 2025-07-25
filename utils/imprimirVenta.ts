// utils/imprimirVenta.ts
// @ts-ignore
import html2pdf from "html2pdf.js"

export async function handleImprimirVenta(id_venta: number) {
  try {
    const [ventaRes, configRes] = await Promise.all([
      fetch(`/api/ventas/${id_venta}`),
      fetch("/api/configuracion")
    ])

    const ventaData = await ventaRes.json()
    const configData = await configRes.json()

    if (!ventaData.venta) {
      console.error("❌ Venta no encontrada")
      return
    }

    const venta = ventaData.venta
    const nombreNegocio = configData?.nombre_negocio || "Ferretería"
    const rucNegocio = configData?.ruc || ""

    const contenidoHTML = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 32px;
        max-width: 800px;
        margin: auto;
        color: #2d3748;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      ">
        <div style="display: flex; align-items: center; margin-bottom: 24px;">
          <img src="/logo.jpg" alt="Logo" style="height: 64px; margin-right: 24px; object-fit: contain;" />
          <div>
            <h1 style="margin: 0; font-size: 1.6rem; color: #2d3748;">${nombreNegocio}</h1>
            <p style="margin: 2px 0 0; font-size: 0.95rem; color: #4a5568;">
              <strong>RUC:</strong> ${rucNegocio}
            </p>
            <h2 style="margin: 4px 0 0; font-size: 1.1rem; color: #4a5568;">Factura #${venta.id_venta}</h2>
            <p style="margin: 2px 0 0; font-size: 0.95rem; color: #718096;">
              ${new Date(venta.fecha).toLocaleString("es-NI")}
            </p>
          </div>
        </div>

        <div style="margin-bottom: 24px; font-size: 1rem;">
          <p><strong>Cliente:</strong> ${venta.cliente}</p>
          <p><strong>Método de pago:</strong> ${venta.metodo_pago}</p>
        </div>

        <table style="
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
          color: #4a5568;
        ">
          <thead>
            <tr style="background: #f7fafc; border-bottom: 2px solid #e2e8f0;">
              <th style="text-align: left; padding: 12px 16px;">Producto</th>
              <th style="text-align: center; padding: 12px 16px;">Cantidad</th>
              <th style="text-align: right; padding: 12px 16px;">Precio U.</th>
              <th style="text-align: right; padding: 12px 16px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${venta.productos
              .map(
                (p: any) => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px;">${p.producto}</td>
                <td style="text-align: center; padding: 12px 16px;">${p.cantidad}</td>
                <td style="text-align: right; padding: 12px 16px;">C$${Number(p.precio_unitario).toFixed(2)}</td>
                <td style="text-align: right; padding: 12px 16px;">C$${Number(p.subtotal).toFixed(2)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>

        <div style="margin-top: 28px; text-align: right; font-size: 1rem; color: #2d3748;">
          <p><strong>Subtotal:</strong> C$${Number(venta.subtotal).toFixed(2)}</p>
          <p><strong>Impuesto (${venta.porcentaje_impuesto}%):</strong> C$${Number(venta.impuesto).toFixed(2)}</p>
          <p style="font-size: 1.25rem; font-weight: 700; margin-top: 8px;">
            Total: C$${Number(venta.total).toFixed(2)}
          </p>
        </div>

        <div style="
          text-align: center;
          margin-top: 48px;
          font-size: 0.9rem;
          color: #718096;
          font-style: italic;
        ">
          <p>¡Gracias por su compra!</p>
        </div>
      </div>
    `

    const opt = {
      margin: 0.5,
      filename: `venta_${venta.id_venta}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }

    html2pdf().set(opt).from(contenidoHTML).save()
  } catch (error) {
    console.error("❌ Error al imprimir venta:", error)
  }
}
