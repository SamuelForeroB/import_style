import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements AfterViewInit {
  form = { nombre: '', email: '', contrasena: '', confirmar: '', codigoAdmin: '' };
  error = '';
  cargando = false;
  CODIGO_ADMIN = 'ADMIN123';

  constructor(private api: ApiService, private router: Router) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const canvas = document.getElementById('bg-canvas2') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const particles: any[] = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.6 + 0.1
        });
      }
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width*0.6);
        grad.addColorStop(0, 'rgba(201,168,76,0.06)'); grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
          for (let j = i+1; j < particles.length; j++) {
            const p2 = particles[j];
            const d = Math.sqrt((p.x-p2.x)**2 + (p.y-p2.y)**2);
            if (d < 120) {
              ctx.beginPath(); ctx.strokeStyle = `rgba(201,168,76,${0.12*(1-d/120)})`; ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
          ctx.fillStyle = `rgba(201,168,76,${p.alpha})`; ctx.fill();
        }
        requestAnimationFrame(draw);
      };
      draw();
    }, 100);
  }

  registrar() {
    if (!this.form.nombre || !this.form.email || !this.form.contrasena) {
      this.error = 'Todos los campos son obligatorios'; return;
    }
    if (this.form.contrasena !== this.form.confirmar) {
      this.error = 'Las contraseñas no coinciden'; return;
    }
    if (this.form.codigoAdmin !== this.CODIGO_ADMIN) {
      this.error = 'Código de administrador incorrecto'; return;
    }
    this.cargando = true;
    this.api.registro({
      nombre: this.form.nombre,
      email: this.form.email,
      contrasena: this.form.contrasena,
      rol: 'admin'
    }).subscribe({
      next: () => { alert('✅ Cuenta creada correctamente'); this.router.navigate(['/login']); },
      error: (e: any) => { this.error = e.error?.detail || 'Error al registrar'; this.cargando = false; }
    });
  }
}