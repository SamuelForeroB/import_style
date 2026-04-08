from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from esquema import eschema as eschema_zapatos
from modelos import model_producto
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = "import_style_secret_2024"
ALGORITHM = "HS256"

# ── AUTH ──────────────────────────────────────────────

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        usuario = db.query(model_producto.Usuario).filter(
            model_producto.Usuario.email == form.username
        ).first()
        if not usuario or usuario.contrasena != form.password:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
        token_data = {"sub": usuario.email, "nombre": usuario.nombre, "rol": usuario.rol}
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {
            "access_token": token,
            "token_type": "bearer",
            "nombre": usuario.nombre,
            "rol": usuario.rol
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/registro", response_model=eschema_zapatos.UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def registro(usuario: eschema_zapatos.UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(model_producto.Usuario).filter(
        model_producto.Usuario.email == usuario.email
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    nuevo = model_producto.Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        contrasena=usuario.contrasena,
        rol=usuario.rol
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/usuarios")
async def get_usuarios(db: Session = Depends(get_db)):
    return db.query(model_producto.Usuario).all()


# ── ROOT ──────────────────────────────────────────────

@router.get("/")
async def consultar():
    return "Consultar tienda de Import Style"


# ── PRODUCTOS ─────────────────────────────────────────

@router.get("/prod_all")
async def leer_productos(db: Session = Depends(get_db)):
    return db.query(model_producto.Producto).all()


@router.get("/prod/{id_producto}")
async def buscar_prod(id_producto: int, db: Session = Depends(get_db)):
    producto = db.query(model_producto.Producto).get(id_producto)
    if producto:
        return producto
    raise HTTPException(status_code=404, detail=f"Producto con id {id_producto} no encontrado")


@router.post("/prod_add", response_model=eschema_zapatos.Producto, status_code=status.HTTP_201_CREATED)
async def crearProducto(producto: eschema_zapatos.Producto, session: Session = Depends(get_db)):
    productoAdd = model_producto.Producto(
        nombre=producto.nombre, marca=producto.marca, categoria=producto.categoria,
        talla=producto.talla, color=producto.color, precio=producto.precio,
        stock=producto.stock, import_style=producto.import_style, id_proveedor=producto.id_proveedor
    )
    session.add(productoAdd)
    session.commit()
    session.refresh(productoAdd)
    return productoAdd


@router.put("/prod_update/{id_producto}", response_model=eschema_zapatos.Producto)
async def update_Prod(id_producto: int, producs: eschema_zapatos.Producto, db: Session = Depends(get_db)):
    producto = db.query(model_producto.Producto).filter(model_producto.Producto.id_producto == id_producto).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    producto.nombre=producs.nombre; producto.marca=producs.marca; producto.categoria=producs.categoria
    producto.talla=producs.talla; producto.color=producs.color; producto.precio=producs.precio
    producto.stock=producs.stock; producto.import_style=producs.import_style; producto.id_proveedor=producs.id_proveedor
    db.commit(); db.refresh(producto)
    return producto


@router.delete("/prod_borrar/{id_prod}")
async def borrarProd(id_prod: int, db: Session = Depends(get_db)):
    producto = db.query(model_producto.Producto).filter(model_producto.Producto.id_producto == id_prod).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto); db.commit()
    return f"Producto {id_prod} borrado"


# ── PROVEEDORES ───────────────────────────────────────

@router.get("/prov_all")
async def leer_proveedores(db: Session = Depends(get_db)):
    return db.query(model_producto.Proveedor).all()


@router.get("/prov/{id_proveedor}")
async def buscar_prov(id_proveedor: int, db: Session = Depends(get_db)):
    proveedor = db.query(model_producto.Proveedor).get(id_proveedor)
    if proveedor:
        return proveedor
    raise HTTPException(status_code=404, detail=f"Proveedor {id_proveedor} no encontrado")


@router.post("/prov_add", response_model=eschema_zapatos.Proveedor, status_code=status.HTTP_201_CREATED)
async def crearProveedor(proveedor: eschema_zapatos.Proveedor, session: Session = Depends(get_db)):
    proveedorAdd = model_producto.Proveedor(
        nombre=proveedor.nombre, contacto=proveedor.contacto, telefono=proveedor.telefono,
        email=proveedor.email, ciudad=proveedor.ciudad, pais=proveedor.pais
    )
    session.add(proveedorAdd); session.commit(); session.refresh(proveedorAdd)
    return proveedorAdd


@router.put("/prov_update/{id_proveedor}", response_model=eschema_zapatos.Proveedor)
async def update_Prov(id_proveedor: int, provs: eschema_zapatos.Proveedor, db: Session = Depends(get_db)):
    proveedor = db.query(model_producto.Proveedor).filter(model_producto.Proveedor.id_proveedor == id_proveedor).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    proveedor.nombre=provs.nombre; proveedor.contacto=provs.contacto; proveedor.telefono=provs.telefono
    proveedor.email=provs.email; proveedor.ciudad=provs.ciudad; proveedor.pais=provs.pais
    db.commit(); db.refresh(proveedor)
    return proveedor


@router.delete("/prov_borrar/{id_prov}")
async def borrarProv(id_prov: int, db: Session = Depends(get_db)):
    proveedor = db.query(model_producto.Proveedor).filter(model_producto.Proveedor.id_proveedor == id_prov).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(proveedor); db.commit()
    return f"Proveedor {id_prov} borrado"


# ── CLIENTES ──────────────────────────────────────────

@router.get("/cli_all")
async def leer_clientes(db: Session = Depends(get_db)):
    return db.query(model_producto.Cliente).all()


@router.get("/cli/{id_cliente}")
async def buscar_cli(id_cliente: int, db: Session = Depends(get_db)):
    cliente = db.query(model_producto.Cliente).get(id_cliente)
    if cliente:
        return cliente
    raise HTTPException(status_code=404, detail=f"Cliente {id_cliente} no encontrado")


@router.post("/cli_add", response_model=eschema_zapatos.Cliente, status_code=status.HTTP_201_CREATED)
async def crearCliente(cliente: eschema_zapatos.Cliente, session: Session = Depends(get_db)):
    clienteAdd = model_producto.Cliente(
        nombre=cliente.nombre, apellido=cliente.apellido, telefono=cliente.telefono,
        email=cliente.email, direccion=cliente.direccion, ciudad=cliente.ciudad
    )
    session.add(clienteAdd); session.commit(); session.refresh(clienteAdd)
    return clienteAdd


@router.put("/cli_update/{id_cliente}", response_model=eschema_zapatos.Cliente)
async def update_Cli(id_cliente: int, clis: eschema_zapatos.Cliente, db: Session = Depends(get_db)):
    cliente = db.query(model_producto.Cliente).filter(model_producto.Cliente.id_cliente == id_cliente).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    cliente.nombre=clis.nombre; cliente.apellido=clis.apellido; cliente.telefono=clis.telefono
    cliente.email=clis.email; cliente.direccion=clis.direccion; cliente.ciudad=clis.ciudad
    db.commit(); db.refresh(cliente)
    return cliente


@router.delete("/cli_borrar/{id_cli}")
async def borrarCli(id_cli: int, db: Session = Depends(get_db)):
    cliente = db.query(model_producto.Cliente).filter(model_producto.Cliente.id_cliente == id_cli).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(cliente); db.commit()
    return f"Cliente {id_cli} borrado"


# ── PEDIDOS ───────────────────────────────────────────

@router.get("/ped_all")
async def leer_pedidos(db: Session = Depends(get_db)):
    return db.query(model_producto.Pedido).all()


@router.get("/ped/{id_pedido}")
async def buscar_ped(id_pedido: int, db: Session = Depends(get_db)):
    pedido = db.query(model_producto.Pedido).get(id_pedido)
    if pedido:
        return pedido
    raise HTTPException(status_code=404, detail=f"Pedido {id_pedido} no encontrado")


@router.post("/ped_add", response_model=eschema_zapatos.Pedido, status_code=status.HTTP_201_CREATED)
async def crearPedido(pedido: eschema_zapatos.Pedido, session: Session = Depends(get_db)):
    pedidoAdd = model_producto.Pedido(
        id_cliente=pedido.id_cliente, fecha_pedido=pedido.fecha_pedido,
        estado=pedido.estado, total=pedido.total
    )
    session.add(pedidoAdd); session.commit(); session.refresh(pedidoAdd)
    return pedidoAdd


@router.put("/ped_update/{id_pedido}", response_model=eschema_zapatos.Pedido)
async def update_Ped(id_pedido: int, peds: eschema_zapatos.Pedido, db: Session = Depends(get_db)):
    pedido = db.query(model_producto.Pedido).filter(model_producto.Pedido.id_pedido == id_pedido).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    pedido.id_cliente=peds.id_cliente; pedido.fecha_pedido=peds.fecha_pedido
    pedido.estado=peds.estado; pedido.total=peds.total
    db.commit(); db.refresh(pedido)
    return pedido


@router.delete("/ped_borrar/{id_ped}")
async def borrarPed(id_ped: int, db: Session = Depends(get_db)):
    pedido = db.query(model_producto.Pedido).filter(model_producto.Pedido.id_pedido == id_ped).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    db.delete(pedido); db.commit()
    return f"Pedido {id_ped} borrado"