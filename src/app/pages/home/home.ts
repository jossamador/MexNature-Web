import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import mapboxgl from 'mapbox-gl';
// 👇 ¡LA CORRECCIÓN MÁS IMPORTANTE ESTÁ AQUÍ!
import { PlaceService, Place } from '../../services/place';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private placeService = inject(PlaceService);
  private map!: mapboxgl.Map;
  
  loading = true;
  error: string | null = null;

  ngAfterViewInit(): void {
    this.initializeMap();
    this.loadPlaces();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    try {
      (mapboxgl as any).accessToken = environment.mapboxToken;

      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-99.1332, 19.4326],
        zoom: 5
      });

      this.map.on('load', () => {
        console.log('Map loaded successfully');
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      this.error = 'Error al inicializar el mapa. Verifica tu token de Mapbox.';
      this.loading = false;
    }
  }

  private loadPlaces(): void {
    this.placeService.getPlaces().subscribe({
      next: (places: Place[]) => {
        console.log('Places loaded:', places);
        places.forEach((place: Place) => {
          new mapboxgl.Marker()
            .setLngLat([place.longitude, place.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div style="min-width: 200px;">
                <h5 style="margin: 0 0 8px 0; color: #2d3748;">${place.name}</h5>
                <p style="margin: 0; font-size: 0.9em; color: #4a5568;">
                  <strong>Categoría:</strong> ${place.category}
                </p>
              </div>
            `))
            .addTo(this.map);
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading places:', error);
        this.error = 'Error al cargar los lugares. Verifica que la API esté funcionando.';
        this.loading = false;
      }
    });
  }
}