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
  clientes: any[] = [];
  pedidos: any[] = [];
  intervalo: any;

  get stockBajo() { return this.productos.filter(p => p.stock < 5).length; }
  get productosStockBajo() { return this.productos.filter(p => p.stock < 5); }
  get totalInventario() { return this.productos.reduce((a, p) => a + (p.precio * p.stock), 0); }
  get pedidosPendientes() { return this.pedidos.filter(p => p.estado === 'Pendiente').length; }

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargar();
    this.intervalo = setInterval(() => this.cargar(), 2000);
  }

  ngOnDestroy() { clearInterval(this.intervalo); }

  cargar() {
    this.api.getProductos().subscribe((d: any[]) => { this.productos = d; this.cdr.detectChanges(); });
    this.api.getClientes().subscribe((d: any[]) => { this.clientes = d; this.cdr.detectChanges(); });
    this.api.getPedidos().subscribe((d: any[]) => { this.pedidos = d; this.cdr.detectChanges(); });
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}