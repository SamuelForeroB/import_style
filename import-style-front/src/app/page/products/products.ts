import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  size: number;
  color: string;
  price: number;
  stock: number;
  import_style: string;
  emoji: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  search    = signal('');
  activeCat = signal('Todos');
  sortBy    = signal('default');
  cartOpen  = signal(false);
  cart      = signal<Product[]>([]);
  toast     = signal('');

  categories = ['Todos', 'Lifestyle', 'Running', 'Casual'];

  allProducts: Product[] = [
    { id:1,  name:'Air Jordan 4 "Singles Day Red"',       brand:'Nike',   category:'Lifestyle', size:42, color:'Rojo/Negro',        price:950000,  stock:6,  import_style:'Edición Limitada', emoji:'👟' },
    { id:2,  name:'Air Jordan 4 "Photon Dust"',           brand:'Nike',   category:'Lifestyle', size:41, color:'Gris/Blanco',       price:880000,  stock:8,  import_style:'Importado',        emoji:'👟' },
    { id:3,  name:'Air Jordan 4 "Cool Grey"',             brand:'Nike',   category:'Lifestyle', size:43, color:'Gris/Negro',        price:870000,  stock:5,  import_style:'Importado',        emoji:'👟' },
    { id:4,  name:'Air Jordan 3 "Off Noir"',              brand:'Nike',   category:'Lifestyle', size:40, color:'Negro/Gris',        price:820000,  stock:7,  import_style:'Importado',        emoji:'👟' },
    { id:5,  name:'Air Jordan 3 "Black Cat"',             brand:'Nike',   category:'Lifestyle', size:42, color:'Negro',             price:850000,  stock:4,  import_style:'Edición Limitada', emoji:'👟' },
    { id:6,  name:'Air Jordan 3 x Fragment Design',       brand:'Nike',   category:'Lifestyle', size:41, color:'Azul/Blanco',       price:1200000, stock:3,  import_style:'Edición Limitada', emoji:'👟' },
    { id:7,  name:'Air Jordan 3 "Black Flip"',            brand:'Nike',   category:'Lifestyle', size:43, color:'Negro/Blanco',      price:890000,  stock:5,  import_style:'Importado',        emoji:'👟' },
    { id:8,  name:'Nike Air More Uptempo "Royal Blue"',   brand:'Nike',   category:'Lifestyle', size:44, color:'Azul/Blanco',       price:750000,  stock:9,  import_style:'Importado',        emoji:'👟' },
    { id:9,  name:'Nike Shox TL "Triple White"',          brand:'Nike',   category:'Running',   size:41, color:'Blanco',            price:680000,  stock:11, import_style:'Importado',        emoji:'👟' },
    { id:10, name:'Nike Air Force 1 x Louis Vuitton',     brand:'Nike',   category:'Casual',    size:42, color:'Blanco/Café',       price:1800000, stock:2,  import_style:'Edición Limitada', emoji:'👟' },
    { id:11, name:'Nike Air Force 1 "Triple Black Glitter"', brand:'Nike',category:'Casual',   size:40, color:'Negro Brillante',    price:520000,  stock:14, import_style:'Importado',        emoji:'👟' },
    { id:12, name:'Nike Air Max 90 "Triple Red"',         brand:'Nike',   category:'Running',   size:43, color:'Rojo',              price:590000,  stock:10, import_style:'Importado',        emoji:'👟' },
    { id:13, name:'Nike Air Max Plus TN "Triple White"',  brand:'Nike',   category:'Running',   size:41, color:'Blanco',            price:620000,  stock:12, import_style:'Nacional',         emoji:'👟' },
    { id:14, name:'Nike Air Max Plus TN "Iridescent Black"',brand:'Nike', category:'Running',   size:42, color:'Negro Iridiscente', price:680000,  stock:7,  import_style:'Importado',        emoji:'👟' },
    { id:15, name:'Nike Air Force 1 Low "Beige/Black"',   brand:'Nike',   category:'Casual',    size:39, color:'Beige/Negro',       price:490000,  stock:15, import_style:'Nacional',         emoji:'👟' },
    { id:16, name:'Adidas Samba "Soft Pink"',             brand:'Adidas', category:'Casual',    size:38, color:'Rosa Suave',        price:420000,  stock:13, import_style:'Importado',        emoji:'🥿' },
    { id:17, name:'Adidas Ultraboost 24',                 brand:'Adidas', category:'Running',   size:41, color:'Negro/Blanco',      price:620000,  stock:10, import_style:'Importado',        emoji:'🥿' },
    { id:18, name:'Adidas Forum Low "Cloud White"',       brand:'Adidas', category:'Casual',    size:43, color:'Blanco',            price:380000,  stock:16, import_style:'Nacional',         emoji:'🥿' },
    { id:19, name:'Adidas Gazelle "Collegiate Green"',    brand:'Adidas', category:'Lifestyle', size:40, color:'Verde/Blanco',      price:410000,  stock:9,  import_style:'Importado',        emoji:'🥿' },
    { id:20, name:'Adidas Yeezy Boost 350 V2 "Onyx"',    brand:'Adidas', category:'Lifestyle', size:42, color:'Negro',             price:980000,  stock:4,  import_style:'Edición Limitada', emoji:'🥿' },
  ];

  filtered = computed(() => {
    let list = [...this.allProducts];
    if (this.activeCat() !== 'Todos')
      list = list.filter(p => p.category === this.activeCat());
    const q = this.search().toLowerCase().trim();
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.color.toLowerCase().includes(q)
    );
    switch (this.sortBy()) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'stock':      list.sort((a,b) => b.stock - a.stock); break;
    }
    return list;
  });

  get cartCount() { return this.cart().length; }
  get cartTotal() { return this.cart().reduce((t,p) => t + p.price, 0); }

  badgeColor(style: string) {
    if (style === 'Edición Limitada') return 'badge-limited';
    if (style === 'Nacional') return 'badge-nacional';
    return 'badge-import';
  }

  stockColor(stock: number) {
    if (stock <= 4)  return 'stock-low';
    if (stock <= 10) return 'stock-mid';
    return 'stock-ok';
  }

  addToCart(p: Product) {
    this.cart.update(c => [...c, {...p}]);
    this.cartOpen.set(true);
    this.toast.set(`✅ ${p.name} agregado`);
    setTimeout(() => this.toast.set(''), 2500);
  }
  removeFromCart(i: number) { this.cart.update(c => c.filter((_,idx) => idx !== i)); }
  toggleCart() { this.cartOpen.update(v => !v); }
}