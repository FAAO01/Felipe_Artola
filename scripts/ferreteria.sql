-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3307
-- Tiempo de generación: 15-07-2025 a las 18:57:28
-- Versión del servidor: 8.0.30
-- Versión de PHP: 7.4.33

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
  `id_categoria` int NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `estado` enum('activo','inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_documento` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numero_documento` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('activo','inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `puntos_fidelizacion` int DEFAULT '0',
  `nivel_fidelizacion` enum('bronce','plata','oro','platino') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'bronce',
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

CREATE TABLE `configuracion` (
  `id_configuracion` int NOT NULL,
  `nombre_negocio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `moneda` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `impuesto` decimal(5,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`id_configuracion`, `nombre_negocio`, `moneda`, `impuesto`) VALUES
(1, ' Ferretería', '$', 10.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id_detalle_venta` int NOT NULL,
  `id_venta` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` int NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id_permiso`, `nombre`) VALUES
(8, 'categorias'),
(2, 'clientes'),
(6, 'configuracion'),
(7, 'copia-seguridad'),
(10, 'Dashboard'),
(3, 'productos'),
(9, 'proveedores'),
(4, 'reportes'),
(5, 'usuarios'),
(1, 'ventas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int NOT NULL,
  `id_categoria` int DEFAULT NULL,
  `id_proveedor` int DEFAULT NULL,
  `codigo_barras` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `factor_conversion` decimal(10,2) DEFAULT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `stock_minimo` int DEFAULT NULL,
  `estado` enum('activo','inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int NOT NULL,
  `nombre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ruc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `estado` enum('activo','inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int NOT NULL,
  `nombre_rol` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `nivel_acceso` int DEFAULT NULL,
  `funciones` text COLLATE utf8mb4_general_ci,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0'
) ;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`, `descripcion`, `nivel_acceso`, `funciones`, `fecha_creacion`, `usuario_creacion`, `usuario_modificacion`, `fecha_modificacion`, `eliminado`) VALUES
(5, 'Super-admin', 'Super usuario', 1, 'dashboard,productos,copia de seguridad,configuracion,proveedores,clientes,reportes,categoria,ventas,usuarios', '2025-07-14 17:05:47', NULL, NULL, NULL, 0),
(6, 'Vendedor', 'Ventas y clientes', 2, 'clientes,ventas', '2025-07-14 17:09:33', NULL, NULL, NULL, 0),
(7, 'Gerente', 'Proveedores, Productos, Clientes, Categorías, Ventas', 3, 'productos,proveedores,categoria,clientes,ventas', '2025-07-14 17:10:50', NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL,
  `id_rol` int DEFAULT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena_temporal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_expiracion_contrasena` datetime DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `estado` enum('activo','inactivo','bloqueado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `ultimo_login` datetime DEFAULT NULL,
  `intentos_fallidos` int DEFAULT '0',
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nombre`, `apellido`, `email`, `usuario`, `contrasena`, `contrasena_temporal`, `fecha_expiracion_contrasena`, `telefono`, `direccion`, `estado`, `fecha_creacion`, `ultimo_login`, `intentos_fallidos`, `usuario_creacion`, `usuario_modificacion`, `fecha_modificacion`, `eliminado`) VALUES
(2, 5, 'Felipe', 'Artola', 'felipe@demo.com', 'FAAO', '$2b$10$jf7c.S2dbN4OMupVGSV8h.v9tIkeQtgeOGBTUBtNgTx3tj1vyq5Gq', NULL, NULL, '86019295', 'Residencial Las Delicias, casa M421', 'activo', '2025-07-14 17:06:53', '2025-07-14 17:16:14', 0, 1, NULL, NULL, 0),
(3, 6, 'Antonio', 'Artola', 'ventas@distcentral.com', 'Ventas', '$2b$10$bbRCLocN3OjiARRSnhLRFeaHWBUE8k9DLv2Amy6eL2B2ii6q5ITci', NULL, NULL, '7678654', 'Managua', 'activo', '2025-07-14 17:12:16', '2025-07-14 17:26:38', 0, 1, NULL, NULL, 0),
(14, 7, 'Gerente', 'Osorno', 'carmonabernaldiego@gmail.com', 'gerente', '$2b$10$Omizsq.Y7M9Q9ch36JA0hu382ZU/lWuO7uwfFRueMsP02Vmys3IU6', NULL, NULL, '58288684', 'blibertada', 'activo', '2025-07-14 17:14:14', '2025-07-14 17:14:50', 0, 1, NULL, '2025-07-14 17:14:22', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int NOT NULL,
  `id_cliente` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `numero_factura` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_venta` datetime DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `impuesto` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('pendiente','cancelado','a_domicilio','vip_pagado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `metodo_pago` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0',
  `abono` decimal(10,2) NOT NULL DEFAULT '0.00',
  `saldo_pendiente` decimal(10,2) NOT NULL DEFAULT '0.00'
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
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`id_configuracion`);

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
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_permiso`),
  ADD UNIQUE KEY `nombre` (`nombre`);

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
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

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
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `id_configuracion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id_detalle_venta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id_permiso` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `detalle_ventas_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `detalle_ventas_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`);

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
