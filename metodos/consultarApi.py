from sqlalchemy import Column, Integer, String
from database import Base, get_db
from fastapi import APIRouter, Query, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from esquema import eschema as eschema_zapatos
from modelos import model_producto

router = APIRouter()


@router.get("/")
async def consultar():
    return "Consultar tienda de Import Style"




@router.get("/prod_all")
async def leer_productos(db: Session = Depends(get_db)):
    producto = db.query(model_producto.Producto).all()
    return producto


@router.get("/prod/{id_producto}")
async def buscar_prod(id_producto: int, db: Session = Depends(get_db)):
    producto = db.query(model_producto.Producto).get(id_producto)
    if producto:
        return producto
    else:
        raise HTTPException(status_code=404, detail=f"Producto con id {id_producto} no encontrado")


@router.post("/prod_add", response_model=eschema_zapatos.Producto, status_code=status.HTTP_201_CREATED)
async def crearProducto(producto: eschema_zapatos.Producto, session: Session = Depends(get_db)):
    productoAdd = model_producto.Producto(
        nombre       = producto.nombre,
        marca        = producto.marca,
        categoria    = producto.categoria,
        talla        = producto.talla,
        color        = producto.color,
        precio       = producto.precio,
        stock        = producto.stock,
        import_style = producto.import_style,
        id_proveedor = producto.id_proveedor
    )
    session.add(productoAdd)
    session.commit()
    session.refresh(productoAdd)
    return productoAdd


@router.put("/prod_update/{id_producto}", response_model=eschema_zapatos.Producto)
async def update_Prod(id_producto: int, producs: eschema_zapatos.Producto, db: Session = Depends(get_db)):
    producto = db.query(model_producto.Producto).filter(model_producto.Producto.id_producto == id_producto).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado..")
    producto.nombre       = producs.nombre
    producto.marca        = producs.marca
    producto.categoria    = producs.categoria
    producto.talla        = producs.talla
    producto.color        = producs.color
    producto.precio       = producs.precio
    producto.stock        = producs.stock
    producto.import_style = producs.import_style
    producto.id_proveedor = producs.id_proveedor
    db.commit()
    db.refresh(producto)
    return producto


@router.delete("/prod_borrar/{id_prod}")
async def borrarProd(id_prod: int, db: Session = Depends(get_db)):
    producto = db.query(model_producto.Producto).filter(
        model_producto.Producto.id_producto == id_prod
    ).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado....")
    db.delete(producto)
    db.commit()
    return f"El campo {id_prod} ha sido borrado"




@router.get("/prov_all")
async def leer_proveedores(db: Session = Depends(get_db)):
    proveedor = db.query(model_producto.Proveedor).all()
    return proveedor


@router.get("/prov/{id_proveedor}")
async def buscar_prov(id_proveedor: int, db: Session = Depends(get_db)):
    proveedor = db.query(model_producto.Proveedor).get(id_proveedor)
    if proveedor:
        return proveedor
    else:
        raise HTTPException(status_code=404, detail=f"Proveedor con id {id_proveedor} no encontrado")


@router.post("/prov_add", response_model=eschema_zapatos.Proveedor, status_code=status.HTTP_201_CREATED)
async def crearProveedor(proveedor: eschema_zapatos.Proveedor, session: Session = Depends(get_db)):
    proveedorAdd = model_producto.Proveedor(
        nombre   = proveedor.nombre,
        contacto = proveedor.contacto,
        telefono = proveedor.telefono,
        email    = proveedor.email,
        ciudad   = proveedor.ciudad,
        pais     = proveedor.pais
    )
    session.add(proveedorAdd)
    session.commit()
    session.refresh(proveedorAdd)
    return proveedorAdd


@router.put("/prov_update/{id_proveedor}", response_model=eschema_zapatos.Proveedor)
async def update_Prov(id_proveedor: int, provs: eschema_zapatos.Proveedor, db: Session = Depends(get_db)):
    proveedor = db.query(model_producto.Proveedor).filter(model_producto.Proveedor.id_proveedor == id_proveedor).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado..")
    proveedor.nombre   = provs.nombre
    proveedor.contacto = provs.contacto
    proveedor.telefono = provs.telefono
    proveedor.email    = provs.email
    proveedor.ciudad   = provs.ciudad
    proveedor.pais     = provs.pais
    db.commit()
    db.refresh(proveedor)
    return proveedor


@router.delete("/prov_borrar/{id_prov}")
async def borrarProv(id_prov: int, db: Session = Depends(get_db)):
    proveedor = db.query(model_producto.Proveedor).filter(
        model_producto.Proveedor.id_proveedor == id_prov
    ).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado....")
    db.delete(proveedor)
    db.commit()
    return f"El campo {id_prov} ha sido borrado"




@router.get("/cli_all")
async def leer_clientes(db: Session = Depends(get_db)):
    cliente = db.query(model_producto.Cliente).all()
    return cliente


@router.get("/cli/{id_cliente}")
async def buscar_cli(id_cliente: int, db: Session = Depends(get_db)):
    cliente = db.query(model_producto.Cliente).get(id_cliente)
    if cliente:
        return cliente
    else:
        raise HTTPException(status_code=404, detail=f"Cliente con id {id_cliente} no encontrado")


@router.post("/cli_add", response_model=eschema_zapatos.Cliente, status_code=status.HTTP_201_CREATED)
async def crearCliente(cliente: eschema_zapatos.Cliente, session: Session = Depends(get_db)):
    clienteAdd = model_producto.Cliente(
        nombre    = cliente.nombre,
        apellido  = cliente.apellido,
        telefono  = cliente.telefono,
        email     = cliente.email,
        direccion = cliente.direccion,
        ciudad    = cliente.ciudad
    )
    session.add(clienteAdd)
    session.commit()
    session.refresh(clienteAdd)
    return clienteAdd


@router.put("/cli_update/{id_cliente}", response_model=eschema_zapatos.Cliente)
async def update_Cli(id_cliente: int, clis: eschema_zapatos.Cliente, db: Session = Depends(get_db)):
    cliente = db.query(model_producto.Cliente).filter(model_producto.Cliente.id_cliente == id_cliente).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado..")
    cliente.nombre    = clis.nombre
    cliente.apellido  = clis.apellido
    cliente.telefono  = clis.telefono
    cliente.email     = clis.email
    cliente.direccion = clis.direccion
    cliente.ciudad    = clis.ciudad
    db.commit()
    db.refresh(cliente)
    return cliente


@router.delete("/cli_borrar/{id_cli}")
async def borrarCli(id_cli: int, db: Session = Depends(get_db)):
    cliente = db.query(model_producto.Cliente).filter(
        model_producto.Cliente.id_cliente == id_cli
    ).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado....")
    db.delete(cliente)
    db.commit()
    return f"El campo {id_cli} ha sido borrado"




@router.get("/ped_all")
async def leer_pedidos(db: Session = Depends(get_db)):
    pedido = db.query(model_producto.Pedido).all()
    return pedido


@router.get("/ped/{id_pedido}")
async def buscar_ped(id_pedido: int, db: Session = Depends(get_db)):
    pedido = db.query(model_producto.Pedido).get(id_pedido)
    if pedido:
        return pedido
    else:
        raise HTTPException(status_code=404, detail=f"Pedido con id {id_pedido} no encontrado")


@router.post("/ped_add", response_model=eschema_zapatos.Pedido, status_code=status.HTTP_201_CREATED)
async def crearPedido(pedido: eschema_zapatos.Pedido, session: Session = Depends(get_db)):
    pedidoAdd = model_producto.Pedido(
        id_cliente   = pedido.id_cliente,
        fecha_pedido = pedido.fecha_pedido,
        estado       = pedido.estado,
        total        = pedido.total
    )
    session.add(pedidoAdd)
    session.commit()
    session.refresh(pedidoAdd)
    return pedidoAdd


@router.put("/ped_update/{id_pedido}", response_model=eschema_zapatos.Pedido)
async def update_Ped(id_pedido: int, peds: eschema_zapatos.Pedido, db: Session = Depends(get_db)):
    pedido = db.query(model_producto.Pedido).filter(model_producto.Pedido.id_pedido == id_pedido).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado..")
    pedido.id_cliente   = peds.id_cliente
    pedido.fecha_pedido = peds.fecha_pedido
    pedido.estado       = peds.estado
    pedido.total        = peds.total
    db.commit()
    db.refresh(pedido)
    return pedido


@router.delete("/ped_borrar/{id_ped}")
async def borrarPed(id_ped: int, db: Session = Depends(get_db)):
    pedido = db.query(model_producto.Pedido).filter(
        model_producto.Pedido.id_pedido == id_ped
    ).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado....")
    db.delete(pedido)
    db.commit()
    return f"El campo {id_ped} ha sido borrado"

