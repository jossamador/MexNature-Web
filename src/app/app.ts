import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar'; // <-- Corregimos la ruta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent], // <-- AÑADIMOS EL SIDEBAR AQUÍ
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'MexNature.Web';
}