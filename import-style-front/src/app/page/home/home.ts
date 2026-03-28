import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  // Lista de zapatos destacados (los más vendidos de tu BD)
  zapatos = [
    {
      nombre: 'Air Jordan 4 "Singles Day Red"',
      marca: 'Nike',
      precio: 950000,
      color: 'Rojo/Negro',
      talla: 42,
      tipo: 'Edición Limitada',
      emoji: '👟'
    },
    {
      nombre: 'Nike Air Force 1 x Louis Vuitton',
      marca: 'Nike',
      precio: 1800000,
      color: 'Blanco/Café',
      talla: 42,
      tipo: 'Edición Limitada',
      emoji: '👟'
    },
    {
      nombre: 'Adidas Yeezy Boost 350 V2 "Onyx"',
      marca: 'Adidas',
      precio: 980000,
      color: 'Negro',
      talla: 42,
      tipo: 'Edición Limitada',
      emoji: '🥿'
    },
    {
      nombre: 'Air Jordan 3 x Fragment Design',
      marca: 'Nike',
      precio: 1200000,
      color: 'Azul/Blanco',
      talla: 41,
      tipo: 'Edición Limitada',
      emoji: '👟'
    },
    {
      nombre: 'Adidas Samba "Soft Pink"',
      marca: 'Adidas',
      precio: 420000,
      color: 'Rosa Suave',
      talla: 38,
      tipo: 'Importado',
      emoji: '🥿'
    },
    {
      nombre: 'Nike Air Max Plus TN "Triple White"',
      marca: 'Nike',
      precio: 620000,
      color: 'Blanco',
      talla: 41,
      tipo: 'Nacional',
      emoji: '👟'
    }
  ];

  // Ventajas de la tienda
  ventajas = [
    { icono: '🚚', titulo: 'Envío Gratis',   texto: 'En pedidos mayores a $200.000' },
    { icono: '✅', titulo: 'Originales',      texto: 'Todos nuestros productos son auténticos' },
    { icono: '🔄', titulo: 'Devoluciones',   texto: '30 días para cambios sin preguntas' },
    { icono: '🔒', titulo: 'Pago Seguro',    texto: 'Transacciones protegidas' }
  ];

  // Marcas que manejamos
  marcas = ['Nike', 'Adidas', 'Jordan', 'Vans', 'Converse', 'Puma', 'New Balance', 'Reebok'];
}