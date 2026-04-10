import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent implements OnInit, OnDestroy {
  pedidos: any[] = [];
  mostrarModal = false;
  intervalo: any;
  esAdmin = false;
  form = { id_cliente: 1, fecha_pedido: '', estado: 'Pendiente', total: 0 };

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.esAdmin = usuario.rol === 'admin' || usuario.rol === 'dueño';
    this.cargar();
    this.intervalo = setInterval(() => this.cargar(), 30000);
  }

  ngOnDestroy() { clearInterval(this.intervalo); }

  cargar() {
    this.api.getPedidos().subscribe((d: any[]) => {
      this.pedidos = d;
      this.cdr.detectChanges();
    });
  }

  abrirModal() {
    this.form = { id_cliente: 1, fecha_pedido: '', estado: 'Pendiente', total: 0 };
    this.mostrarModal = true;
  }

  guardar() {
    this.api.addPedido(this.form).subscribe({
      next: () => { alert('✅ Pedido registrado'); this.cargar(); this.mostrarModal = false; },
      error: () => alert('❌ Error al registrar')
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este pedido?')) {
      this.api.deletePedido(id).subscribe({
        next: () => { alert('✅ Pedido eliminado'); this.cargar(); },
        error: () => alert('❌ Error al eliminar')
      });
    }
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}