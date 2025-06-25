-- Insertar datos iniciales
USE ferreteria;

-- Insertar roles
INSERT INTO `roles` (`nombre_rol`, `descripcion`, `nivel_acceso`) VALUES
('Administrador', 'Acceso completo al sistema', 1),
('Gerente', 'Acceso a gestión y reportes', 2),
('Vendedor', 'Acceso a ventas y clientes', 3);

-- Insertar usuario administrador (contraseña: admin123)
INSERT INTO `usuarios` (`id_rol`, `nombre`, `apellido`, `email`, `usuario`, `contrasena`, `estado`) VALUES
(1, 'Admin', 'Sistema', 'admin@ferreteria.com', 'admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'activo');


-- Insertar categorías
INSERT INTO `categorias` (`nombre`, `descripcion`, `usuario_creacion`) VALUES
('Herramientas Manuales', 'Martillos, destornilladores, llaves', 1),
('Herramientas Eléctricas', 'Taladros, sierras, lijadoras', 1),
('Materiales de Construcción', 'Cemento, ladrillos, arena', 1),
('Plomería', 'Tuberías, conexiones, grifos', 1),
('Electricidad', 'Cables, interruptores, enchufes', 1),
('Ferretería General', 'Tornillos, clavos, adhesivos', 1);

-- Insertar proveedores
INSERT INTO `proveedores` (`nombre`, `ruc`, `telefono`, `email`, `direccion`, `usuario_creacion`) VALUES
('Distribuidora Central', '20123456789', '01-234-5678', 'ventas@distcentral.com', 'Av. Industrial 123', 1),
('Herramientas del Norte', '20987654321', '01-876-5432', 'contacto@hernorte.com', 'Jr. Comercio 456', 1),
('Materiales Lima', '20456789123', '01-555-0123', 'info@matlima.com', 'Av. Construcción 789', 1);

-- Insertar productos
INSERT INTO `productos` (`id_categoria`, `id_proveedor`, `codigo_barras`, `nombre`, `descripcion`, `precio_compra`, `precio_venta`, `stock`, `stock_minimo`, `usuario_creacion`) VALUES
(1, 1, '7501234567890', 'Martillo de Garra 16oz', 'Martillo con mango de fibra de vidrio', 25.00, 45.00, 50, 10, 1),
(1, 1, '7501234567891', 'Destornillador Phillips #2', 'Destornillador con mango ergonómico', 8.00, 15.00, 100, 20, 1),
(2, 2, '7501234567892', 'Taladro Inalámbrico 18V', 'Taladro con batería de litio', 180.00, 320.00, 15, 5, 1),
(3, 3, '7501234567893', 'Cemento Portland 42.5kg', 'Cemento para construcción general', 22.00, 35.00, 200, 50, 1),
(4, 1, '7501234567894', 'Tubería PVC 4 pulgadas', 'Tubería para desagüe por metro', 12.00, 20.00, 80, 15, 1),
(5, 2, '7501234567895', 'Cable THW 12 AWG', 'Cable eléctrico por metro', 3.50, 6.00, 500, 100, 1);

-- Insertar clientes
INSERT INTO `clientes` (`nombre`, `apellido`, `tipo_documento`, `numero_documento`, `email`, `telefono`, `direccion`, `usuario_creacion`) VALUES
('Juan', 'Pérez', 'DNI', '12345678', 'juan.perez@email.com', '987654321', 'Av. Los Olivos 123', 1),
('María', 'García', 'DNI', '87654321', 'maria.garcia@email.com', '987654322', 'Jr. Las Flores 456', 1),
('Carlos', 'López', 'RUC', '20123456789', 'carlos.lopez@empresa.com', '987654323', 'Av. Industrial 789', 1);
