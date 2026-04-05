import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit, OnDestroy {
  productos: any[] = [];
  mostrarModal = false;
  editando = false;
  idEditando: number | null = null;
  intervalo: any;
  form = { nombre: '', marca: 'Nike', categoria: '', talla: 42, color: '', precio: 0, stock: 0, import_style: 'Importado', id_proveedor: 1 };

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargar();
    this.intervalo = setInterval(() => this.cargar(), 2000);
  }

  ngOnDestroy() { clearInterval(this.intervalo); }

  cargar() {
    this.api.getProductos().subscribe((d: any[]) => {
      this.productos = d;
      this.cdr.detectChanges();
    });
  }

  abrirModal() {
    this.editando = false;
    this.form = { nombre: '', marca: 'Nike', categoria: '', talla: 42, color: '', precio: 0, stock: 0, import_style: 'Importado', id_proveedor: 1 };
    this.mostrarModal = true;
  }

  editarProducto(p: any) {
    this.editando = true;
    this.idEditando = p.id_producto;
    this.form = { nombre: p.nombre, marca: p.marca, categoria: p.categoria, talla: p.talla, color: p.color, precio: p.precio, stock: p.stock, import_style: p.import_style, id_proveedor: p.id_proveedor };
    this.mostrarModal = true;
  }

  guardar() {
    if (this.editando && this.idEditando) {
      this.api.updateProducto(this.idEditando, this.form).subscribe({
        next: () => { alert('✅ Producto actualizado'); this.cargar(); this.cerrarModal(); },
        error: () => alert('❌ Error al actualizar')
      });
    } else {
      this.api.addProducto(this.form).subscribe({
        next: () => { alert('✅ Producto guardado'); this.cargar(); this.cerrarModal(); },
        error: () => alert('❌ Error al guardar')
      });
    }
  }

  eliminarProducto(id: number) {
    if (confirm('¿Eliminar?')) {
      this.api.deleteProducto(id).subscribe({
        next: () => { alert('✅ Eliminado'); this.cargar(); },
        error: () => alert('❌ Error')
      });
    }
  }

  cerrarModal() { this.mostrarModal = false; }
  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}