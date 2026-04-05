import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit, OnDestroy {
  clientes: any[] = [];
  mostrarModal = false;
  editando = false;
  idEditando: number | null = null;
  intervalo: any;
  form = { nombre: '', apellido: '', telefono: '', email: '', direccion: '', ciudad: '' };

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargar();
    this.intervalo = setInterval(() => this.cargar(), 2000);
  }

  ngOnDestroy() { clearInterval(this.intervalo); }

  cargar() {
    this.api.getClientes().subscribe((d: any[]) => {
      this.clientes = d;
      this.cdr.detectChanges();
    });
  }

  abrirModal() {
    this.editando = false;
    this.form = { nombre: '', apellido: '', telefono: '', email: '', direccion: '', ciudad: '' };
    this.mostrarModal = true;
  }

  editar(c: any) {
    this.editando = true;
    this.idEditando = c.id_cliente;
    this.form = { nombre: c.nombre, apellido: c.apellido, telefono: c.telefono, email: c.email, direccion: c.direccion, ciudad: c.ciudad };
    this.mostrarModal = true;
  }

  guardar() {
    if (this.editando && this.idEditando) {
      this.api.updateCliente(this.idEditando, this.form).subscribe({
        next: () => { alert('✅ Cliente actualizado'); this.cargar(); this.cerrarModal(); },
        error: () => alert('❌ Error al actualizar')
      });
    } else {
      this.api.addCliente(this.form).subscribe({
        next: () => { alert('✅ Cliente guardado'); this.cargar(); this.cerrarModal(); },
        error: () => alert('❌ Error al guardar')
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este cliente?')) {
      this.api.deleteCliente(id).subscribe({
        next: () => { alert('✅ Cliente eliminado'); this.cargar(); },
        error: () => alert('❌ Error al eliminar')
      });
    }
  }

  cerrarModal() { this.mostrarModal = false; }
  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}