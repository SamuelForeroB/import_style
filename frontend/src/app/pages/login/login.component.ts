import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  email = '';
  password = '';
  error = '';
  cargando = false;

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() { localStorage.clear(); }

  ngAfterViewInit() {
    setTimeout(() => {
      const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
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
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const grad = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, canvas.width * 0.6
        );
        grad.addColorStop(0, 'rgba(201,168,76,0.06)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x, dy = p.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(201,168,76,${0.12 * (1 - dist/120)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
          ctx.fill();
        }
        requestAnimationFrame(draw);
      };
      draw();
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }, 100);
  }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Completa todos los campos';
      this.cdr.detectChanges();
      return;
    }
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();
    this.api.login(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res && res.access_token) {
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('usuario', JSON.stringify({ nombre: res.nombre, rol: res.rol }));
          this.cargando = false;
          this.cdr.detectChanges();
          this.router.navigate(['/dashboard']);
        } else {
          this.cargando = false;
          this.error = '❌ Correo o contraseña incorrectos';
          this.cdr.detectChanges();
        }
      },
      error: (e: any) => {
        this.cargando = false;
        this.error = '❌ Correo o contraseña incorrectos';
        this.cdr.detectChanges();
      },
      complete: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}