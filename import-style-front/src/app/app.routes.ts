import { Routes } from '@angular/router';
import { Home }      from './page/home/home';
import { Products }  from './page/products/products';
import { About }     from './page/about/about';
import { Contact }   from './page/contact/contact';
import { Login }     from './page/login/login';
import { Register }  from './page/register/register';
import { Dashboard } from './page/dashboard/dashboard';

export const routes: Routes = [
  { path: '',          component: Home },
  { path: 'productos', component: Products },
  { path: 'nosotros',  component: About },
  { path: 'contacto',  component: Contact },
  { path: 'login',     component: Login },
  { path: 'register',  component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: '**',        redirectTo: '' }
];