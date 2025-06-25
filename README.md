# Sistema de Gestión de Ferretería

Sistema completo de gestión para ferretería desarrollado con Next.js, MySQL y Tailwind CSS, diseñado para funcionar con Laragon.

## Características

- 🔐 Sistema de autenticación y autorización por roles
- 📦 Gestión completa de productos e inventario
- 🛒 Sistema de ventas con facturación
- 👥 Gestión de clientes con programa de fidelización
- 🏪 Administración de proveedores
- 📊 Dashboard con estadísticas en tiempo real
- 🔔 Sistema de notificaciones
- 💾 Respaldos automáticos
- 📱 Diseño responsive

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Base de Datos**: MySQL (compatible con Laragon)
- **Autenticación**: JWT, bcrypt
- **UI Components**: shadcn/ui, Lucide React

## Instalación con Laragon

### 1. Configurar Laragon

1. Instala y ejecuta Laragon
2. Asegúrate de que MySQL esté corriendo
3. Abre phpMyAdmin (http://localhost/phpmyadmin)

### 2. Configurar la Base de Datos

1. Ejecuta los scripts SQL en el siguiente orden:
   - `scripts/01-create-database.sql`
   - `scripts/02-seed-data.sql`

### 3. Instalar el Proyecto

\`\`\`bash
# Clonar o descargar el proyecto
cd sistema-ferreteria

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
\`\`\`

### 4. Configurar Variables de Entorno

Edita el archivo `.env.local`:

\`\`\`env
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=ferreteria
JWT_SECRET=tu-clave-secreta-aqui
\`\`\`

### 5. Ejecutar el Proyecto

\`\`\`bash
# Modo desarrollo
npm run dev

# El sistema estará disponible en http://localhost:3000
\`\`\`

## Credenciales de Acceso

- **Usuario**: admin
- **Contraseña**: admin123

## Estructura del Proyecto

\`\`\`
sistema-ferreteria/
├── app/
│   ├── api/                 # API Routes
│   ├── dashboard/           # Páginas del dashboard
│   └── page.tsx            # Página de login
├── components/             # Componentes reutilizables
├── lib/                   # Utilidades y configuración
├── scripts/               # Scripts SQL
└── public/               # Archivos estáticos
\`\`\`

## Funcionalidades Principales

### Dashboard
- Estadísticas de ventas diarias
- Conteo de productos y clientes
- Alertas de stock bajo
- Actividad reciente del sistema

### Gestión de Productos
- CRUD completo de productos
- Control de inventario
- Códigos de barras
- Categorización
- Alertas de stock mínimo

### Sistema de Ventas
- Proceso de venta completo
- Facturación automática
- Múltiples métodos de pago
- Historial de ventas

### Gestión de Clientes
- Registro de clientes
- Sistema de fidelización por puntos
- Niveles de cliente (Bronce, Plata, Oro, Platino)

### Administración
- Gestión de usuarios y roles
- Configuración del sistema
- Respaldos de base de datos
- Reportes y estadísticas

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `PUT /api/productos/[id]` - Actualizar producto
- `DELETE /api/productos/[id]` - Eliminar producto

### Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Registrar venta
- `GET /api/ventas/[id]` - Detalle de venta

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales

## Configuración de Producción

Para desplegar en producción:

1. Configura las variables de entorno de producción
2. Usa una base de datos MySQL dedicada
3. Configura HTTPS
4. Implementa respaldos automáticos
5. Configura monitoreo y logs

## Soporte

Para soporte técnico o consultas:
- Revisa la documentación de la API
- Verifica los logs del sistema
- Consulta los scripts SQL para estructura de datos

## Licencia

Este proyecto es de uso interno para sistemas de ferretería.
