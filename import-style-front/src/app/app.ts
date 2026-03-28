import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header></app-header>
    <main><router-outlet></router-outlet></main>
    <app-footer></app-footer>
  `,
  styles: [`main { min-height: 100vh; }`]
})
export class App {}