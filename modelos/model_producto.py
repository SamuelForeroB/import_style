from sqlalchemy import Column, Integer, String, Numeric, Date, Enum, ForeignKey
from database import Base


class Proveedor(Base):
    __tablename__ = "proveedores"
    id_proveedor = Column(Integer, primary_key=True, autoincrement=True)
    nombre       = Column(String(100), nullable=False)
    contacto     = Column(String(100))
    telefono     = Column(String(20))
    email        = Column(String(100))
    ciudad       = Column(String(60))
    pais         = Column(String(60), default="Colombia")


class Cliente(Base):
    __tablename__ = "clientes"
    id_cliente = Column(Integer, primary_key=True, autoincrement=True)
    nombre     = Column(String(100), nullable=False)
    apellido   = Column(String(100), nullable=False)
    telefono   = Column(String(20))
    email      = Column(String(100))
    direccion  = Column(String(200))
    ciudad     = Column(String(60))


class Producto(Base):
    __tablename__ = "productos"
    id_producto  = Column(Integer, primary_key=True, autoincrement=True)
    nombre       = Column(String(150), nullable=False)
    marca        = Column(Enum("Nike", "Adidas"), nullable=False)
    categoria    = Column(String(60))
    talla        = Column(Numeric(4, 1), nullable=False)
    color        = Column(String(50))
    precio       = Column(Numeric(10, 2), nullable=False)
    stock        = Column(Integer, nullable=False, default=0)
    import_style = Column(Enum("Nacional", "Importado", "Exclusivo", "Edición Limitada"), default="Importado")
    id_proveedor = Column(Integer, ForeignKey("proveedores.id_proveedor"))


class Pedido(Base):
    __tablename__ = "pedidos"
    id_pedido    = Column(Integer, primary_key=True, autoincrement=True)
    id_cliente   = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=False)
    fecha_pedido = Column(Date)
    estado       = Column(Enum("Pendiente", "Enviado", "Entregado", "Cancelado"), default="Pendiente")
    total        = Column(Numeric(12, 2), default=0.00)


class DetallePedido(Base):
    __tablename__ = "detalle_pedidos"
    id_detalle      = Column(Integer, primary_key=True, autoincrement=True)
    id_pedido       = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False)
    id_producto     = Column(Integer, ForeignKey("productos.id_producto"), nullable=False)
    cantidad        = Column(Integer, nullable=False, default=1)
    precio_unitario = Column(Numeric(10, 2), nullable=False)


class Usuario(Base):
    __tablename__ = "usuarios"
    id_usuario = Column(Integer, primary_key=True, autoincrement=True)
    nombre     = Column(String(100), nullable=False)
    email      = Column(String(100), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    rol        = Column(Enum("dueño", "empleado", "admin"), default="empleado")