import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent implements OnInit, OnDestroy {
  proveedores: any[] = [];
  mostrarModal = false;
  editando = false;
  idEditando: number | null = null;
  intervalo: any;
  form = { nombre: '', contacto: '', telefono: '', email: '', ciudad: '', pais: 'Colombia' };

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargar();
    this.intervalo = setInterval(() => this.cargar(), 2000);
  }

  ngOnDestroy() { clearInterval(this.intervalo); }

  cargar() {
    this.api.getProveedores().subscribe((d: any[]) => {
      this.proveedores = d;
      this.cdr.detectChanges();
    });
  }

  abrirModal() {
    this.editando = false;
    this.form = { nombre: '', contacto: '', telefono: '', email: '', ciudad: '', pais: 'Colombia' };
    this.mostrarModal = true;
  }

  editar(p: any) {
    this.editando = true;
    this.idEditando = p.id_proveedor;
    this.form = { nombre: p.nombre, contacto: p.contacto, telefono: p.telefono, email: p.email, ciudad: p.ciudad, pais: p.pais };
    this.mostrarModal = true;
  }

  guardar() {
    if (this.editando && this.idEditando) {
      this.api.updateProveedor(this.idEditando, this.form).subscribe({
        next: () => { alert('✅ Proveedor actualizado'); this.cargar(); this.mostrarModal = false; },
        error: () => alert('❌ Error al actualizar')
      });
    } else {
      this.api.addProveedor(this.form).subscribe({
        next: () => { alert('✅ Proveedor guardado'); this.cargar(); this.mostrarModal = false; },
        error: () => alert('❌ Error al guardar')
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este proveedor?')) {
      this.api.deleteProveedor(id).subscribe({
        next: () => { alert('✅ Proveedor eliminado'); this.cargar(); },
        error: () => alert('❌ Error al eliminar')
      });
    }
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}