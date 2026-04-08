from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date


class Proveedor(BaseModel):
    id_proveedor: Optional[int] = None
    nombre:   str
    contacto: Optional[str] = None
    telefono: Optional[str] = None
    email:    Optional[str] = None
    ciudad:   Optional[str] = None
    pais:     Optional[str] = None
    class Config:
        orm_mode = True


class Cliente(BaseModel):
    id_cliente: Optional[int] = None
    nombre:    str
    apellido:  str
    telefono:  Optional[str] = None
    email:     Optional[str] = None
    direccion: Optional[str] = None
    ciudad:    Optional[str] = None
    class Config:
        orm_mode = True


class Producto(BaseModel):
    id_producto:  Optional[int] = None
    nombre:       str
    marca:        str
    categoria:    Optional[str] = None
    talla:        Decimal
    color:        Optional[str] = None
    precio:       Decimal
    stock:        int
    import_style: Optional[str] = None
    id_proveedor: Optional[int] = None
    class Config:
        orm_mode = True


class Pedido(BaseModel):
    id_pedido:    Optional[int] = None
    id_cliente:   int
    fecha_pedido: Optional[date] = None
    estado:       Optional[str] = None
    total:        Optional[Decimal] = None
    class Config:
        orm_mode = True


class DetallePedido(BaseModel):
    id_detalle:      Optional[int] = None
    id_pedido:       int
    id_producto:     int
    cantidad:        int
    precio_unitario: Decimal
    class Config:
        orm_mode = True


class UsuarioCreate(BaseModel):
    nombre:    str
    email:     str
    contrasena: str
    rol:       Optional[str] = "empleado"


class UsuarioResponse(BaseModel):
    id_usuario: int
    nombre:     str
    email:      str
    rol:        str
    class Config:
        orm_mode = True


class LoginResponse(BaseModel):
    access_token: str
    token_type:   str
    nombre:       str
    rol:          str