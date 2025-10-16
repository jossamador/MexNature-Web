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
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    try {
      console.log('Initializing map...');
      (mapboxgl as any).accessToken = environment.mapboxToken;

      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-99.1332, 19.4326],
        zoom: 5
      });

      // 🔧 CRÍTICO: Cargar lugares SOLO después de que el mapa esté listo
      this.map.on('load', () => {
        console.log('Map loaded successfully');
        this.loadPlaces(); // ← Movido aquí
      });

      this.map.on('error', (error) => {
        console.error('Map error:', error);
        this.error = 'Error al cargar el mapa. Verifica tu token de Mapbox.';
        this.loading = false;
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      this.error = 'Error al inicializar el mapa. Verifica tu token de Mapbox.';
      this.loading = false;
    }
  }

  private loadPlaces(): void {
    console.log('Loading places...');
    this.placeService.getPlaces().subscribe({
      next: (places: Place[]) => {
        console.log('Places loaded:', places);
        console.log('Total places received:', places.length);
        
        if (places && places.length > 0) {
          let validPlacesCount = 0;
          places.forEach((place: Place, index) => {
            console.log(`Processing place ${index + 1}:`, place.name, `(${place.latitude}, ${place.longitude})`);
            
            // Validar que las coordenadas estén en rangos válidos para México
            const isValidLatitude = place.latitude >= 14 && place.latitude <= 33; // Rango aproximado de México
            const isValidLongitude = place.longitude >= -118 && place.longitude <= -86; // Rango aproximado de México
            
            if (isValidLatitude && isValidLongitude) {
              console.log('✅ Valid coordinates, adding marker for:', place.name);
              new mapboxgl.Marker()
                .setLngLat([place.longitude, place.latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`
                  <div style="min-width: 200px;">
                    <h5 style="margin: 0 0 8px 0; color: #2d3748;">${place.name}</h5>
                    <p style="margin: 0; font-size: 0.9em; color: #4a5568;">
                      <strong>Categoría:</strong> ${place.category}
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 0.8em; color: #718096;">
                      📍 ${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}
                    </p>
                  </div>
                `))
                .addTo(this.map);
              validPlacesCount++;
            } else {
              console.warn('❌ Invalid coordinates for:', place.name, 
                `Lat: ${place.latitude} (valid: 14-33), Lng: ${place.longitude} (valid: -118 to -86)`);
            }
          });
          
          console.log(`✅ Added ${validPlacesCount} valid markers out of ${places.length} total places`);
          
          if (validPlacesCount === 0) {
            console.warn('No valid places found with coordinates in Mexico range');
          }
        } else {
          console.warn('No places found');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading places:', error);
        this.error = 'Error al cargar los lugares. Verifica que la API esté funcionando.';
        this.loading = false;
      }
    });
  }

  retryLoad(): void {
    this.error = null;
    this.loading = true;
    this.initializeMap();
  }
}