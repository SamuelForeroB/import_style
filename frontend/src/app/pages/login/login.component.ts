import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {
    // Usuario demo - luego conectar con la API
    if (this.email === 'safb1214@gmail.com' && this.password === '123') {
      localStorage.setItem('usuario', JSON.stringify({ nombre: 'Maikol Gomez', rol: 'dueño' }));
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Correo o contraseña incorrectos';

      
    }
  }
}


