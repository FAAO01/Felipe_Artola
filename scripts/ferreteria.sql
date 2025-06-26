-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-05-2025 a las 16:09:00
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ferreteria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `tipo_documento` varchar(20) DEFAULT NULL,
  `numero_documento` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `puntos_fidelizacion` int(11) DEFAULT 0,
  `nivel_fidelizacion` enum('bronce','plata','oro','platino') DEFAULT 'bronce',
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `numero_factura` varchar(50) DEFAULT NULL,
  `fecha_compra` datetime DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `impuesto` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('pendiente','finalizada','anulada') DEFAULT 'pendiente',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion_sistema`
--

CREATE TABLE `configuracion_sistema` (
  `id_configuracion` int(11) NOT NULL,
  `clave` varchar(50) DEFAULT NULL,
  `valor` text DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cupones`
--

CREATE TABLE `cupones` (
  `id_cupon` int(11) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo_descuento` enum('porcentaje','monto_fijo') DEFAULT NULL,
  `valor_descuento` decimal(10,2) DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compras`
--

CREATE TABLE `detalle_compras` (
  `id_detalle_compra` int(11) NOT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_devoluciones`
--

CREATE TABLE `detalle_devoluciones` (
  `id_detalle_devolucion` int(11) NOT NULL,
  `id_devolucion` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id_detalle_venta` int(11) NOT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devoluciones`
--

CREATE TABLE `devoluciones` (
  `id_devolucion` int(11) NOT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_devolucion` datetime DEFAULT current_timestamp(),
  `motivo` text DEFAULT NULL,
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_productos`
--

CREATE TABLE `imagenes_productos` (
  `id_imagen` int(11) NOT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `ruta_imagen` varchar(255) DEFAULT NULL,
  `tipo_imagen` enum('principal','secundaria','galeria') DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `impuestos`
--

CREATE TABLE `impuestos` (
  `id_impuesto` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `monedas`
--

CREATE TABLE `monedas` (
  `id_moneda` int(11) NOT NULL,
  `codigo` varchar(3) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `simbolo` varchar(5) DEFAULT NULL,
  `tasa_cambio` decimal(10,4) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id_movimiento` int(11) NOT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `tipo_movimiento` enum('entrada','salida','ajuste','venta','compra') DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `id_referencia` int(11) DEFAULT NULL,
  `tipo_referencia` varchar(50) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_movimiento` datetime DEFAULT current_timestamp(),
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `tipo` enum('sistema','stock','venta','compra') DEFAULT NULL,
  `leida` tinyint(1) DEFAULT 0,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `codigo_barras` varchar(100) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `factor_conversion` decimal(10,2) DEFAULT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respaldos`
--

CREATE TABLE `respaldos` (
  `id_respaldo` int(11) NOT NULL,
  `nombre_archivo` varchar(255) DEFAULT NULL,
  `ruta` varchar(255) DEFAULT NULL,
  `tamano` decimal(10,2) DEFAULT NULL,
  `fecha_respaldo` datetime DEFAULT current_timestamp(),
  `usuario_creacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `nivel_acceso` int(11) DEFAULT NULL CHECK (`nivel_acceso` between 1 and 3),
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `contrasena_temporal` varchar(255) DEFAULT NULL,
  `fecha_expiracion_contrasena` datetime DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `estado` enum('activo','inactivo','bloqueado') DEFAULT 'activo',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `ultimo_login` datetime DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `numero_factura` varchar(50) DEFAULT NULL,
  `fecha_venta` datetime DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `impuesto` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('pendiente','cancelado','a_domicilio','vip_pagado') DEFAULT 'pendiente',
  `metodo_pago` varchar(50) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `usuario_creacion` int(11) DEFAULT NULL,
  `usuario_modificacion` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`),
  ADD KEY `idx_clientes_estado` (`estado`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`),
  ADD KEY `idx_compras_fecha` (`fecha_compra`);

--
-- Indices de la tabla `configuracion_sistema`
--
ALTER TABLE `configuracion_sistema`
  ADD PRIMARY KEY (`id_configuracion`),
  ADD UNIQUE KEY `clave` (`clave`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `cupones`
--
ALTER TABLE `cupones`
  ADD PRIMARY KEY (`id_cupon`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD PRIMARY KEY (`id_detalle_compra`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `detalle_devoluciones`
--
ALTER TABLE `detalle_devoluciones`
  ADD PRIMARY KEY (`id_detalle_devolucion`),
  ADD KEY `id_devolucion` (`id_devolucion`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id_detalle_venta`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD PRIMARY KEY (`id_devolucion`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `impuestos`
--
ALTER TABLE `impuestos`
  ADD PRIMARY KEY (`id_impuesto`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `monedas`
--
ALTER TABLE `monedas`
  ADD PRIMARY KEY (`id_moneda`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `codigo_barras` (`codigo_barras`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`),
  ADD KEY `idx_productos_stock` (`stock`),
  ADD KEY `idx_productos_estado` (`estado`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `respaldos`
--
ALTER TABLE `respaldos`
  ADD PRIMARY KEY (`id_respaldo`),
  ADD KEY `usuario_creacion` (`usuario_creacion`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `idx_usuarios_estado` (`estado`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `usuario_modificacion` (`usuario_modificacion`),
  ADD KEY `idx_ventas_fecha` (`fecha_venta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `configuracion_sistema`
--
ALTER TABLE `configuracion_sistema`
  MODIFY `id_configuracion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cupones`
--
ALTER TABLE `cupones`
  MODIFY `id_cupon` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  MODIFY `id_detalle_compra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_devoluciones`
--
ALTER TABLE `detalle_devoluciones`
  MODIFY `id_detalle_devolucion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id_detalle_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  MODIFY `id_devolucion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `impuestos`
--
ALTER TABLE `impuestos`
  MODIFY `id_impuesto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `monedas`
--
ALTER TABLE `monedas`
  MODIFY `id_moneda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `respaldos`
--
ALTER TABLE `respaldos`
  MODIFY `id_respaldo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `categorias_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `compras_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `compras_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `configuracion_sistema`
--
ALTER TABLE `configuracion_sistema`
  ADD CONSTRAINT `configuracion_sistema_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `configuracion_sistema_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `cupones`
--
ALTER TABLE `cupones`
  ADD CONSTRAINT `cupones_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `cupones_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  ADD CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `detalle_compras_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `detalle_compras_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `detalle_devoluciones`
--
ALTER TABLE `detalle_devoluciones`
  ADD CONSTRAINT `detalle_devoluciones_ibfk_1` FOREIGN KEY (`id_devolucion`) REFERENCES `devoluciones` (`id_devolucion`),
  ADD CONSTRAINT `detalle_devoluciones_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `detalle_devoluciones_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `detalle_devoluciones_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `detalle_ventas_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `detalle_ventas_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  ADD CONSTRAINT `devoluciones_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `devoluciones_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `devoluciones_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  ADD CONSTRAINT `imagenes_productos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `impuestos`
--
ALTER TABLE `impuestos`
  ADD CONSTRAINT `impuestos_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `impuestos_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `monedas`
--
ALTER TABLE `monedas`
  ADD CONSTRAINT `monedas_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `monedas_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `movimientos_inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `movimientos_inventario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `movimientos_inventario_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `movimientos_inventario_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  ADD CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `productos_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `proveedores_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `proveedores_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `respaldos`
--
ALTER TABLE `respaldos`
  ADD CONSTRAINT `respaldos_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `roles_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `ventas_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `ventas_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
