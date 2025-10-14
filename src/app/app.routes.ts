import { Routes } from '@angular/router';
// 👇 Fíjate en los nombres más cortos
import { Home } from './pages/home/home';
import { PlaceList } from './pages/place-list/place-list';
import { TrailList } from './pages/trail-list/trail-list';

export const routes: Routes = [
  // 👇 Y también los usamos aquí
  { path: 'inicio', component: Home },
  { path: 'lugares', component: PlaceList },
  { path: 'senderos', component: TrailList },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/inicio' }
];