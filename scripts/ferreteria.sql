-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: ferreteria
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `estado` enum('activo','inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_categoria`),
  KEY `usuario_creacion` (`usuario_creacion`),
  KEY `usuario_modificacion` (`usuario_modificacion`),
  CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `categorias_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (22,'Cemento Portland 42.5kg, 4x4','Cemento para construcción general','activo',2,2,'2025-07-21 15:59:53',0),(23,'FerroMax','Seguridad, 4X4','activo',2,NULL,NULL,0),(24,'Candado pequeño','Seguridad, 4X4','inactivo',2,2,'2025-07-21 17:41:41',0);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
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
  `eliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_cliente`),
  KEY `usuario_creacion` (`usuario_creacion`),
  KEY `usuario_modificacion` (`usuario_modificacion`),
  KEY `idx_clientes_estado` (`estado`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (11,'Felipe ','Artola','DNI','001-230906-1023D','felipe@demo.com','84295222','Av. Industrial 123','2025-07-20 19:54:43','activo',0,'bronce',2,NULL,NULL,1),(12,'Felipe ','Artola','DNI','001-280100-1029D','admin@demo.com','58288684','Managua','2025-07-20 19:57:01','activo',0,'bronce',2,NULL,NULL,0),(13,'Dara','Zuniga','DNI','001-230906-1023D','vendedor@ferreteria.com','7678654','Managua','2025-07-20 23:06:18','activo',0,'bronce',2,NULL,NULL,0);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion`
--

DROP TABLE IF EXISTS `configuracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion` (
  `id_configuracion` int NOT NULL AUTO_INCREMENT,
  `nombre_negocio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `moneda` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `impuesto` decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_configuracion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion`
--

LOCK TABLES `configuracion` WRITE;
/*!40000 ALTER TABLE `configuracion` DISABLE KEYS */;
INSERT INTO `configuracion` VALUES (1,' Ferretería','S',10.00);
/*!40000 ALTER TABLE `configuracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_ventas`
--

DROP TABLE IF EXISTS `detalle_ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_ventas` (
  `id_detalle_venta` int NOT NULL AUTO_INCREMENT,
  `id_venta` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_detalle_venta`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  KEY `usuario_creacion` (`usuario_creacion`),
  KEY `usuario_modificacion` (`usuario_modificacion`),
  CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `detalle_ventas_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `detalle_ventas_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_ventas`
--

LOCK TABLES `detalle_ventas` WRITE;
/*!40000 ALTER TABLE `detalle_ventas` DISABLE KEYS */;
INSERT INTO `detalle_ventas` VALUES (50,28,18,1,550.00,NULL,550.00,2,NULL,NULL),(54,29,18,1,550.00,NULL,550.00,2,NULL,NULL),(55,30,19,1,535.00,NULL,535.00,2,NULL,NULL),(58,32,18,1,550.00,NULL,550.00,2,NULL,NULL),(60,33,18,1,550.00,NULL,550.00,2,NULL,NULL),(63,31,18,1,550.00,NULL,550.00,2,NULL,NULL),(64,35,22,1,450.00,NULL,450.00,2,NULL,NULL),(65,34,19,1,535.00,NULL,535.00,2,NULL,NULL);
/*!40000 ALTER TABLE `detalle_ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (8,'categorias'),(2,'clientes'),(6,'configuracion'),(7,'copia-seguridad'),(10,'Dashboard'),(3,'productos'),(9,'proveedores'),(4,'reportes'),(5,'usuarios'),(1,'ventas');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
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
  `eliminado` tinyint(1) DEFAULT '0',
  `stock_minimos` int DEFAULT '0',
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `codigo_barras` (`codigo_barras`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_proveedor` (`id_proveedor`),
  KEY `usuario_creacion` (`usuario_creacion`),
  KEY `usuario_modificacion` (`usuario_modificacion`),
  KEY `idx_productos_stock` (`stock`),
  KEY `idx_productos_estado` (`estado`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `productos_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (18,22,21,'7501234567893','Cemento Portland 42.5kg, 4x4','',NULL,0.00,550.00,5,34,'activo','2025-07-20 22:36:17',2,NULL,NULL,0,0),(19,22,15,'23432545354','Cemento Portland 42.5kg','',NULL,0.00,535.00,30,50,'activo','2025-07-20 22:39:44',2,NULL,NULL,0,0),(22,23,21,'012','Cemento Portland 42.5kg, 4x4 nuevo','',NULL,0.00,450.00,9,50,'activo','2025-07-21 17:16:20',2,NULL,NULL,0,0),(23,24,21,'2222222222','Antonio','',NULL,0.00,7.00,90,100,'activo','2025-07-21 20:14:46',2,NULL,NULL,0,0);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
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
  `eliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_proveedor`),
  KEY `usuario_creacion` (`usuario_creacion`),
  KEY `usuario_modificacion` (`usuario_modificacion`),
  CONSTRAINT `proveedores_ibfk_1` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `proveedores_ibfk_2` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (12,'Felipe 2','20123456789','00000001','felipe@demo.com','Av. Industrial 123','activo','2025-07-20 21:50:41',2,NULL,NULL,0),(15,'FerroMax','0000000000002','00000001','vendedor@ferreteria.com','libertada','activo','2025-07-20 22:01:16',2,NULL,NULL,0),(18,'Dara','4432245233','7678654','admin@demo.com','Residencial Las Delicias, casa M421','inactivo','2025-07-20 22:11:06',2,NULL,NULL,0),(21,'Cemento Portland 42.5kg, 4x4','0000000000001','00000001','felipe@demo.com','Managua','inactivo','2025-07-20 22:28:18',2,NULL,NULL,0);
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `nivel_acceso` int DEFAULT NULL,
  `funciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_creacion` int DEFAULT NULL,
  `usuario_modificacion` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (5,'Super-admin','Acceso a las siguientes funciones',1,'dashboard,productos,copia de seguridad,configuracion,proveedores,clientes,reportes,categoria,ventas,usuarios','2025-07-14 17:05:47',NULL,NULL,NULL,0),(6,'Vendedor','Acceso a las siguientes funciones ',2,'clientes,ventas','2025-07-14 17:09:33',NULL,NULL,NULL,0),(7,'Gerente','Acceso a las siguientes funciones',3,'productos,proveedores,categoria,clientes,ventas','2025-07-14 17:10:50',NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
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
  `eliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `id_rol` (`id_rol`),
  KEY `idx_usuarios_estado` (`estado`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (2,5,'Felipe','Artola','felipe@demo.com','FAAO','$2b$10$jf7c.S2dbN4OMupVGSV8h.v9tIkeQtgeOGBTUBtNgTx3tj1vyq5Gq',NULL,NULL,'86019295','Residencial Las Delicias, casa M421','activo','2025-07-14 17:06:53','2025-07-23 20:38:09',0,1,NULL,NULL,0),(3,6,'Antonio','Artola','ventas@distcentral.com','Ventas','$2b$10$bbRCLocN3OjiARRSnhLRFeaHWBUE8k9DLv2Amy6eL2B2ii6q5ITci',NULL,NULL,'7678654','Managua','activo','2025-07-14 17:12:16','2025-07-23 17:00:40',0,1,NULL,NULL,0),(14,7,'Gerente','Osorno','carmonabernaldiego@gmail.com','gerente','$2b$10$Omizsq.Y7M9Q9ch36JA0hu382ZU/lWuO7uwfFRueMsP02Vmys3IU6',NULL,NULL,'58288684','blibertada','activo','2025-07-14 17:14:14','2025-07-23 17:00:19',0,1,NULL,'2025-07-14 17:14:22',0),(15,6,'Admin','Admin','admin@demo.com','admin','$2b$10$esDf/kOadBRXkHTDymglIOI2zYzDOhmF3bnv4Ulc6t1GmYdveLFMa',NULL,NULL,'7678654','Managua','activo','2025-07-20 17:26:23','2025-07-20 17:38:23',0,1,NULL,NULL,0),(22,7,'Adriana M','Zuniga G','adriana@demo.com','Adriana','$2b$10$nfVSX53QMLRRosbmOtr4feU9iFOsSxCUXbOlIcwLXiWMlFjhSbLfK',NULL,NULL,'88371104','Puerto Cabezas','activo','2025-07-23 17:15:54','2025-07-23 17:57:43',0,1,NULL,'2025-07-23 17:17:53',0),(24,6,'Axel J','Morales O','axel@demo.com','Axel J','$2b$10$4UnVcY/moo.vUkLi09Bff.VL.TLtc9avqyrfi6lMOgMJesbtd0wCu',NULL,NULL,'83657373','Puerto Cabezas','activo','2025-07-23 17:19:07',NULL,0,1,NULL,NULL,0),(33,6,'Vannesa','Ortiz','vannesa@demo.com','vanne','$2b$10$qYv0Q2zrAxkxH2UboltpteCT0/pMyNAnkn40GlD/nnq1PFCgKKjHS',NULL,NULL,'99999999','Managua','activo','2025-07-23 17:54:58',NULL,0,1,NULL,'2025-07-23 17:58:17',1),(36,7,'NUEVO','NUEVO','NUEVO','NUEVO','$2b$10$QoCwayoAqoHFSepg.a8vYOI4ajdemIfRIwZ3H8RmSzR.//sFSq3ZS',NULL,NULL,'99999999','Managua','activo','2025-07-23 18:33:32','2025-07-23 19:17:18',0,1,NULL,NULL,0),(48,6,'Alejandra','Zuniga','alejandra@gmail.com','alejandra','$2b$10$gUliQma7pj3sJIjo0XHt7uhBwbrDkeOha.RuZlDfQjswQYfXdkIJm',NULL,NULL,'9932242','Puerto Cabezas','inactivo','2025-07-23 19:19:03','2025-07-23 19:20:28',0,1,NULL,'2025-07-23 19:20:52',0);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
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
  `saldo_pendiente` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_venta`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_usuario` (`id_usuario`),
  KEY `usuario_creacion` (`usuario_creacion`),
  KEY `usuario_modificacion` (`usuario_modificacion`),
  KEY `idx_ventas_fecha` (`fecha_venta`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `ventas_ibfk_3` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `ventas_ibfk_4` FOREIGN KEY (`usuario_modificacion`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (28,12,2,'F1753073285443','2025-07-20 22:48:05',550.00,99.00,649.00,NULL,'tarjeta','2025-07-20 22:48:05',2,NULL,NULL,0,0.00,0.00),(29,12,2,'F1753073326512','2025-07-20 22:48:46',550.00,99.00,649.00,NULL,'credito','2025-07-20 22:48:46',2,NULL,NULL,1,300.00,349.00),(30,13,2,'F1753074415726','2025-07-20 23:06:55',535.00,96.30,631.30,NULL,'efectivo','2025-07-20 23:06:55',2,NULL,NULL,0,0.00,0.00),(31,12,2,'F1753075304440','2025-07-20 23:21:44',550.00,99.00,649.00,NULL,'credito','2025-07-20 23:21:44',2,NULL,NULL,0,649.00,0.00),(32,12,2,'F1753119846108','2025-07-21 11:44:06',550.00,99.00,649.00,NULL,'credito','2025-07-21 11:44:06',2,NULL,NULL,1,0.00,0.00),(33,12,2,'F1753127806352','2025-07-21 13:56:46',550.00,99.00,649.00,'pendiente','credito','2025-07-21 13:56:46',2,NULL,NULL,0,649.00,0.00),(34,13,2,'F1753127894154','2025-07-21 13:58:14',535.00,96.30,631.30,'pendiente','credito','2025-07-21 13:58:14',2,NULL,NULL,0,61.30,570.00),(35,13,2,'F1753141539503','2025-07-21 17:45:39',450.00,81.00,531.00,'pendiente','credito','2025-07-21 17:45:39',2,NULL,NULL,1,0.00,531.00);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-23 20:38:28
