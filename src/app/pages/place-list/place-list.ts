import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para usar *ngFor
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { Place, PlaceService } from '../../services/place'; // Importamos el servicio y la interfaz

@Component({
  selector: 'app-place-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadimos FormsModule
  templateUrl: './place-list.html',
  styleUrl: './place-list.css'
})
export class PlaceList implements OnInit {
  // Creamos propiedades para el estado del componente
  public places: Place[] = [];
  public loading = true;
  public error: string | null = null;
  public selectedCategory: string = 'all';
  private placeService = inject(PlaceService);

  // ngOnInit se ejecuta cuando el componente se inicia
  ngOnInit(): void {
    this.loadPlaces();
  }

  loadPlaces(): void {
    this.loading = true;
    this.error = null;
    
    this.placeService.getPlaces().subscribe({
      next: (data) => {
        this.places = data; // Guardamos los datos de la API en nuestra propiedad
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading places:', error);
        this.error = 'Error al cargar los lugares';
        this.loading = false;
      }
    });
  }

  get filteredPlaces(): Place[] {
    if (this.selectedCategory === 'all') {
      return this.places;
    }
    return this.places.filter(place => place.category === this.selectedCategory);
  }

  get categories(): string[] {
    const cats = [...new Set(this.places.map(place => place.category))];
    return cats.sort();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  retryLoad(): void {
    this.loadPlaces();
  }
}