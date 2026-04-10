import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  usuario: any = null;
  productos: any[] = [];
  productosFiltrados: any[] = [];
  clientes: any[] = [];
  pedidos: any[] = [];
  intervalo: any;
  filtroOrden = '';
  filtroMarca = '';

  get stockBajo() { return this.productos.filter(p => p.stock < 5).length; }
  get productosStockBajo() { return this.productos.filter(p => p.stock < 5); }
  get totalInventario() { return this.productos.reduce((a, p) => a + (Number(p.precio) * Number(p.stock)), 0); }
  get pedidosPendientes() { return this.pedidos.filter(p => p.estado === 'Pendiente').length; }
  get totalVentas() { return this.pedidos.reduce((a, p) => a + Number(p.total || 0), 0); }

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargar();
    this.intervalo = setInterval(() => this.cargar(), 30000);
  }

  ngOnDestroy() { clearInterval(this.intervalo); }

  cargar() {
    this.api.getProductos().subscribe((d: any[]) => {
      this.productos = d;
      this.aplicarFiltros();
      this.cdr.detectChanges();
    });
    this.api.getClientes().subscribe((d: any[]) => { this.clientes = d; this.cdr.detectChanges(); });
    this.api.getPedidos().subscribe((d: any[]) => { this.pedidos = d; this.cdr.detectChanges(); });
  }

  aplicarFiltros() {
    let arr = [...this.productos];

    if (this.filtroMarca) {
      arr = arr.filter(p => p.marca === this.filtroMarca);
    }

    if (this.filtroOrden === 'precio_asc') arr.sort((a, b) => Number(a.precio) - Number(b.precio));
    else if (this.filtroOrden === 'precio_desc') arr.sort((a, b) => Number(b.precio) - Number(a.precio));
    else if (this.filtroOrden === 'stock_asc') arr.sort((a, b) => Number(a.stock) - Number(b.stock));
    else if (this.filtroOrden === 'stock_desc') arr.sort((a, b) => Number(b.stock) - Number(a.stock));
    else if (this.filtroOrden === 'nombre') arr.sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.productosFiltrados = arr;
    this.cdr.detectChanges();
  }

  filtrarPor(event: any) {
    this.filtroOrden = event.target.value;
    this.aplicarFiltros();
  }

  filtrarMarca(event: any) {
    this.filtroMarca = event.target.value;
    this.aplicarFiltros();
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}