import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para usar *ngFor
import { Place, PlaceService } from '../../services/place'; // Importamos el servicio y la interfaz

@Component({
  selector: 'app-place-list',
  standalone: true,
  imports: [CommonModule], // Añadimos CommonModule
  templateUrl: './place-list.html',
  styleUrl: './place-list.css'
})
export class PlaceList implements OnInit {
  // Creamos una propiedad para guardar la lista de lugares
  public places: Place[] = [];
  private placeService = inject(PlaceService);

  // ngOnInit se ejecuta cuando el componente se inicia
  ngOnInit(): void {
    this.placeService.getPlaces().subscribe(data => {
      this.places = data; // Guardamos los datos de la API en nuestra propiedad
    });
  }
}