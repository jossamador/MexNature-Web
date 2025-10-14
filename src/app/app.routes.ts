import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlaceListComponent } from './pages/place-list/place-list.component';
import { TrailListComponent } from './pages/trail-list/trail-list.component';

export const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'lugares', component: PlaceListComponent },
  { path: 'senderos', component: TrailListComponent },
  // Ruta por defecto: si la URL está vacía, redirige a /inicio
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  // Ruta comodín: si la URL no coincide con ninguna, redirige a /inicio
  { path: '**', redirectTo: '/inicio' }
];