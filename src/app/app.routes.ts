import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PlaceList } from './pages/place-list/place-list';
import { TrailList } from './pages/trail-list/trail-list';
import { PlaceDetail } from './pages/place-detail/place-detail';

export const routes: Routes = [
  // Rutas específicas
  { path: 'inicio', component: Home },
  { path: 'lugares', component: PlaceList },
  { path: 'lugares/:id', component: PlaceDetail }, // La ruta de detalle
  { path: 'senderos', component: TrailList },

  // Rutas de redirección y comodín SIEMPRE AL FINAL
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Redirige la ruta vacía
  { path: '**', redirectTo: '/inicio' } // Atrapa cualquier otra URL y redirige
];