import DashboardStats from "@/components/dashboard-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MostSoldProductsChart from "@/components/charts/most-sold-products-chart"
import TopCategoryChart from "@/components/charts/top-category-chart"
import MonthlyCopiesChart from "@/components/charts/monthly-copies-chart"
import StockByProductChart from "@/components/charts/stock-by-product-chart"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema de ferretería</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Productos más vendidos</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <MostSoldProductsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categoría más vendida</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <TopCategoryChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes con más copias de seguridad</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <MonthlyCopiesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock por producto</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <StockByProductChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
